import {
  SchemaToSharedLibraryCodeInput,
  SchemaToSharedLibraryCodeInterfaceOptions,
} from '../schema-to-shared-library-code-input';
import {
  ExportDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
} from 'ts-morph';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { asChainable, invariant, sortArrayByStringAsc } from '@gmjs/util';
import {
  MongoAllCollectionsStructure,
  MongoEntityStructure,
  MongoPropertyStructure,
  MongoValueTypeStructureAny,
} from '../../../shared/collection-structure/mongo-collection-structure';
import { schemasToAllCollectionStructures } from '../../../shared/collection-structure/mongo-collection-structure-util';
import {
  getAppInterfacePropertyName,
  isMongoValueType,
  mongoBsonTypeToMongoJsType,
} from '../../../shared/mongo-schema-util';
import { MongoBsonType } from '@gmjs/mongo-util';
import { createTsSourceFile } from '../../../shared/code-util';
import { PathContentPair } from '@gmjs/fs-util';

export interface InterfaceCodeGenerator {
  generate(): readonly PathContentPair[];
}

export function createInterfaceCodeGenerator(
  input: SchemaToSharedLibraryCodeInput,
  isDb: boolean
): InterfaceCodeGenerator {
  if (isDb) {
    return new InterfaceCodeGeneratorDb(input);
  } else {
    return new InterfaceCodeGeneratorApp(input);
  }
}

abstract class InterfaceCodeGeneratorBase implements InterfaceCodeGenerator {
  protected constructor(
    protected readonly input: SchemaToSharedLibraryCodeInput
  ) {}

  public generate(): readonly PathContentPair[] {
    const allCollections = schemasToAllCollectionStructures(this.input.schemas);

    const interfaceIndexFiles =
      this.generateInterfacesIndexFiles(allCollections);

    const collectionInterfaceFiles = allCollections.collectionTypes.map(
      (collectionType) => this.generateInterfaceFile(collectionType, false)
    );
    const embeddedInterfaceFiles = allCollections.embeddedTypes.map(
      (embeddedType) => this.generateInterfaceFile(embeddedType, true)
    );

    return [
      ...interfaceIndexFiles,
      ...collectionInterfaceFiles,
      ...embeddedInterfaceFiles,
    ];
  }

  private generateInterfacesIndexFiles(
    allCollections: MongoAllCollectionsStructure
  ): readonly PathContentPair[] {
    const interfacesDir = this.getInterfacesDir();

    const hasCollections = allCollections.collectionTypes.length > 0;
    const hasEmbedded = allCollections.embeddedTypes.length > 0;

    const interfaceFiles: PathContentPair[] = [];

    if (hasEmbedded) {
      const embeddedIndexFilePath = path.join(
        interfacesDir,
        'embedded/index.ts'
      );
      const embeddedIndexFileContent = createTsSourceFile((sf) => {
        const exportDeclarations: readonly OptionalKind<ExportDeclarationStructure>[] =
          getEntityExportDeclarations(
            allCollections.embeddedTypes,
            this.interfaceOptions.prefix
          );
        sf.addExportDeclarations(exportDeclarations);
      });

      interfaceFiles.push({
        path: embeddedIndexFilePath,
        content: embeddedIndexFileContent,
      });
    }

    if (hasEmbedded || hasCollections) {
      const collectionsIndexFilePath = path.join(interfacesDir, 'index.ts');
      const collectionsIndexFileContent = createTsSourceFile((sf) => {
        const exportDeclarations: OptionalKind<ExportDeclarationStructure>[] =
          [];

        if (hasEmbedded) {
          exportDeclarations.push({
            moduleSpecifier: './embedded',
          });
        }

        exportDeclarations.push(
          ...getEntityExportDeclarations(
            allCollections.collectionTypes,
            this.interfaceOptions.prefix
          )
        );
        sf.addExportDeclarations(exportDeclarations);
      });

      interfaceFiles.push({
        path: collectionsIndexFilePath,
        content: collectionsIndexFileContent,
      });
    }

    return interfaceFiles;
  }

  private generateInterfaceFile(
    entity: MongoEntityStructure,
    isEmbedded: boolean
  ): PathContentPair {
    const entityName = getEntityName(this.interfaceOptions.prefix, entity.name);

    const filePath = getCollectionInterfaceFilePath(
      entityName,
      this.getInterfacesDir(),
      isEmbedded
    );

    const content = createTsSourceFile((sf) => {
      const importDeclarations = this.getInterfaceFileImportDeclarations(
        entity,
        isEmbedded
      );
      sf.addImportDeclarations(importDeclarations);

      const propertySignatures = entity.properties.map((property) =>
        this.getPropertySignature(property)
      );

      sf.addInterface({
        name: entityName,
        isExported: true,
        properties: propertySignatures,
      });
    });

    return {
      path: filePath,
      content,
    };
  }

  private getInterfacesDir(): string {
    return path.join(
      this.input.options.mongoInterfacesDir,
      this.interfaceOptions.dir
    );
  }

  private getInterfaceFileImportDeclarations(
    entity: MongoEntityStructure,
    isEmbedded: boolean
  ): readonly OptionalKind<ImportDeclarationStructure>[] {
    const importDeclarations: OptionalKind<ImportDeclarationStructure>[] = [];

    const mongoImports = sortArrayByStringAsc(
      this.getMongoImportTypes(entity.mongoTypes)
    );

    if (mongoImports.length > 0) {
      importDeclarations.push({
        namedImports: [...mongoImports],
        moduleSpecifier: 'mongodb',
      });
    }

    const localImports = sortArrayByStringAsc(
      entity.embeddedTypes.map((name) =>
        getEntityName(this.interfaceOptions.prefix, name)
      )
    );

    if (localImports.length > 0) {
      if (!isEmbedded) {
        importDeclarations.push({
          namedImports: [...localImports],
          moduleSpecifier: './embedded',
        });
      } else {
        importDeclarations.push(
          ...localImports.map((name) => ({
            namedImports: [name],
            moduleSpecifier: `./${kebabCase(name)}`,
          }))
        );
      }
    }

    return importDeclarations;
  }

  private getPropertySignature(
    property: MongoPropertyStructure
  ): OptionalKind<PropertySignatureStructure> {
    const propertyName = this.getPropertyName(property.name);
    const propertyValueType = this.getValueType(property.valueType, false);
    return {
      name: propertyName,
      isReadonly: true,
      type: propertyValueType,
      hasQuestionToken: property.isOptional,
    };
  }

  private getValueType(
    valueType: MongoValueTypeStructureAny,
    isInArray: boolean
  ): string {
    const type = valueType.bsonType;
    if (type === 'object') {
      return getEntityName(this.interfaceOptions.prefix, valueType.typeName);
    } else if (type === 'array') {
      const itemType = this.getValueType(valueType.items, true);
      const fullArrayType = `readonly ${itemType}[]`;
      return isInArray ? `(${fullArrayType})` : fullArrayType;
    } else {
      return this.getSimpleValueTypeMapping(valueType.bsonType);
    }
  }

  protected abstract get interfaceOptions(): SchemaToSharedLibraryCodeInterfaceOptions;

  protected abstract getMongoImportTypes(
    bsonTypes: readonly MongoBsonType[]
  ): readonly string[];

  protected abstract getPropertyName(initialPropertyName: string): string;

  protected abstract getSimpleValueTypeMapping(type: MongoBsonType): string;
}

class InterfaceCodeGeneratorDb extends InterfaceCodeGeneratorBase {
  public constructor(input: SchemaToSharedLibraryCodeInput) {
    super(input);
  }

  protected get interfaceOptions(): SchemaToSharedLibraryCodeInterfaceOptions {
    return this.input.options.dbInterfaceOptions;
  }

  protected getMongoImportTypes(
    bsonTypes: readonly MongoBsonType[]
  ): readonly string[] {
    return bsonTypes.map((type) => this.getSimpleValueTypeMapping(type));
  }

  protected getPropertyName(initialPropertyName: string): string {
    return initialPropertyName;
  }

  protected getSimpleValueTypeMapping(type: MongoBsonType): string {
    if (isMongoValueType(type)) {
      return mongoBsonTypeToMongoJsType(type);
    }

    switch (type) {
      case 'string':
        return 'string';
      case 'long':
      case 'int':
        return 'number';
      case 'bool':
        return 'boolean';
      case 'date':
        return 'Date';
      default:
        invariant(false, `Invalid property type: '${type}'.`);
    }
  }
}

class InterfaceCodeGeneratorApp extends InterfaceCodeGeneratorBase {
  public constructor(input: SchemaToSharedLibraryCodeInput) {
    super(input);
  }

  protected get interfaceOptions(): SchemaToSharedLibraryCodeInterfaceOptions {
    return this.input.options.appInterfaceOptions;
  }

  protected getMongoImportTypes(
    _bsonTypes: readonly MongoBsonType[]
  ): readonly string[] {
    return [];
  }

  protected getPropertyName(initialPropertyName: string): string {
    return getAppInterfacePropertyName(initialPropertyName);
  }

  protected getSimpleValueTypeMapping(type: MongoBsonType): string {
    switch (type) {
      case 'string':
        return 'string';
      case 'long':
      case 'int':
        return 'number';
      case 'bool':
        return 'boolean';
      case 'decimal':
      case 'objectId':
      case 'date':
        return 'string';
      default:
        invariant(false, `Invalid property type: '${type}'.`);
    }
  }
}

function getEntityName(prefix: string, name: string): string {
  return pascalCase(prefix + pascalCase(name));
}

function getCollectionInterfaceFilePath(
  entityName: string,
  interfacesDir: string,
  isEmbedded: boolean
): string {
  const fileName = `${kebabCase(entityName)}.ts`;
  return path.join(interfacesDir, isEmbedded ? 'embedded' : '', fileName);
}

function getEntityExportDeclarations(
  entities: readonly MongoEntityStructure[],
  prefix: string
): readonly OptionalKind<ExportDeclarationStructure>[] {
  return asChainable(entities)
    .map((item) => item.name)
    .apply(sortArrayByStringAsc)
    .map((name) => ({
      moduleSpecifier: `./${kebabCase(getEntityName(prefix, name))}`,
    }))
    .getValue();
}
