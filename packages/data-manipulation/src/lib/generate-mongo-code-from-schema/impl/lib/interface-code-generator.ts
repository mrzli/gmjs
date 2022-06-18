import {
  GenerateMongoCodeFromSchemaInput,
  GenerateMongoCodeFromSchemaInterfaceOptions,
} from '../util/types';
import {
  ExportDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  Project,
  PropertySignatureStructure,
} from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { MongoJsonSchemaBsonType } from '../../../data-model/mongo-json-schema';
import { asChainable, invariant, sortArrayByStringAsc } from '@gmjs/util';
import {
  MongoAllCollectionsStructure,
  MongoEntityStructure,
  MongoPropertyStructure,
  MongoValueTypeStructureAny,
} from '../util/collection-structure/mongo-collection-structure';
import { schemasToCollectionStructures } from '../util/collection-structure/mongo-collection-structure-util';

export interface InterfaceCodeGenerator {
  generate(): void;
}

export function createInterfaceCodeGenerator(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  optionsHelper: OptionsHelper,
  isDb: boolean
): InterfaceCodeGenerator {
  if (isDb) {
    return new InterfaceCodeGeneratorDb(input, project, optionsHelper);
  } else {
    return new InterfaceCodeGeneratorApp(input, project, optionsHelper);
  }
}

abstract class InterfaceCodeGeneratorBase implements InterfaceCodeGenerator {
  protected constructor(
    protected readonly input: GenerateMongoCodeFromSchemaInput,
    protected readonly project: Project,
    protected readonly optionsHelper: OptionsHelper
  ) {}

  public generate(): void {
    const allCollections = schemasToCollectionStructures(this.input.schemas);

    this.generateInterfacesIndexFiles(allCollections);

    for (const collectionType of allCollections.collectionTypes) {
      this.generateInterfaceFile(collectionType, false);
    }
    for (const embeddedType of allCollections.embeddedTypes) {
      this.generateInterfaceFile(embeddedType, true);
    }
  }

  private generateInterfacesIndexFiles(
    allCollections: MongoAllCollectionsStructure
  ): void {
    const interfacesDir = this.getInterfacesDir();

    const hasCollections = allCollections.collectionTypes.length > 0;
    const hasEmbedded = allCollections.embeddedTypes.length > 0;

    if (hasEmbedded) {
      const embeddedIndexFile = path.join(interfacesDir, 'embedded/index.ts');
      const embeddedIndexSf = this.project.createSourceFile(embeddedIndexFile);
      const exportDeclarations: readonly OptionalKind<ExportDeclarationStructure>[] =
        getEntityExportDeclarations(
          allCollections.embeddedTypes,
          this.interfaceOptions.prefix
        );
      embeddedIndexSf.addExportDeclarations(exportDeclarations);
    }

    if (hasEmbedded || hasCollections) {
      const collectionsIndexFile = path.join(interfacesDir, 'index.ts');

      const collectionsIndexSf =
        this.project.createSourceFile(collectionsIndexFile);

      const exportDeclarations: OptionalKind<ExportDeclarationStructure>[] = [];

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
      collectionsIndexSf.addExportDeclarations(exportDeclarations);
    }
  }

  private generateInterfaceFile(
    entity: MongoEntityStructure,
    isEmbedded: boolean
  ): void {
    const entityName = getEntityName(this.interfaceOptions.prefix, entity.name);

    const filePath = getCollectionInterfaceFilePath(
      entityName,
      this.getInterfacesDir(),
      isEmbedded
    );

    const sf = this.project.createSourceFile(filePath);

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
  }

  private getInterfacesDir(): string {
    return path.join(
      this.optionsHelper.resolveSharedProjectInterfacesRootDir(),
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

  protected abstract get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions;

  protected abstract getMongoImportTypes(
    bsonTypes: readonly MongoJsonSchemaBsonType[]
  ): readonly string[];

  protected abstract getPropertyName(initialPropertyName: string): string;

  protected abstract getSimpleValueTypeMapping(
    type: MongoJsonSchemaBsonType
  ): string;
}

class InterfaceCodeGeneratorDb extends InterfaceCodeGeneratorBase {
  public constructor(
    input: GenerateMongoCodeFromSchemaInput,
    project: Project,
    optionsHelper: OptionsHelper
  ) {
    super(input, project, optionsHelper);
  }

  protected get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions {
    return this.input.options.appsMonorepo.dbInterfaceOptions;
  }

  protected getMongoImportTypes(
    bsonTypes: readonly MongoJsonSchemaBsonType[]
  ): readonly string[] {
    return bsonTypes.map((type) => this.getSimpleValueTypeMapping(type));
  }

  protected getPropertyName(initialPropertyName: string): string {
    return initialPropertyName;
  }

  protected getSimpleValueTypeMapping(type: MongoJsonSchemaBsonType): string {
    switch (type) {
      case 'string':
        return 'string';
      case 'long':
      case 'int':
        return 'number';
      case 'bool':
        return 'boolean';
      case 'decimal':
        return 'Decimal128';
      case 'objectId':
        return 'ObjectId';
      case 'date':
        return 'Date';
      default:
        invariant(false, `Invalid property type: '${type}'.`);
    }
  }
}

class InterfaceCodeGeneratorApp extends InterfaceCodeGeneratorBase {
  public constructor(
    input: GenerateMongoCodeFromSchemaInput,
    project: Project,
    optionsHelper: OptionsHelper
  ) {
    super(input, project, optionsHelper);
  }

  protected get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions {
    return this.input.options.appsMonorepo.appInterfaceOptions;
  }

  protected getMongoImportTypes(
    bsonTypes: readonly MongoJsonSchemaBsonType[]
  ): readonly string[] {
    return [];
  }

  protected getPropertyName(initialPropertyName: string): string {
    return initialPropertyName.replace(/^_+|_+$/g, '');
  }

  protected getSimpleValueTypeMapping(type: MongoJsonSchemaBsonType): string {
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
