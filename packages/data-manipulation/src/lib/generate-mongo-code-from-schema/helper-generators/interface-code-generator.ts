import {
  GenerateMongoCodeFromSchemaInput,
  GenerateMongoCodeFromSchemaInterfaceOptions,
} from '../util/types';
import {
  ImportSpecifierStructure,
  OptionalKind,
  Project,
  PropertySignatureStructure,
  SourceFile,
} from 'ts-morph';
import { PathResolver } from '../util/path-resolver';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import * as path from 'path';
import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaBsonType,
  MongoJsonSchemaTypeObject,
} from '../../data-model/mongo-json-schema';
import {
  asChainable,
  distinctItems,
  invariant,
  ObjectEntry,
  objectGetEntries,
  ReadonlyRecord,
  sortArrayByStringAsc,
} from '@gmjs/util';

export interface InterfaceCodeGenerator {
  generate(): void;
}

export function createInterfaceCodeGenerator(
  input: GenerateMongoCodeFromSchemaInput,
  project: Project,
  pathResolver: PathResolver,
  isDb: boolean
): InterfaceCodeGenerator {
  if (isDb) {
    return new InterfaceCodeGeneratorDb(input, project, pathResolver);
  } else {
    return new InterfaceCodeGeneratorApp(input, project, pathResolver);
  }
}

abstract class InterfaceCodeGeneratorBase implements InterfaceCodeGenerator {
  protected constructor(
    protected readonly input: GenerateMongoCodeFromSchemaInput,
    protected readonly project: Project,
    protected readonly pathResolver: PathResolver
  ) {}

  public generate(): void {
    const generatedInterfaces: GeneratedInterfaceSets = {
      collections: new Set<string>(),
      embedded: new Set<string>(),
    };
    for (const schema of this.input.schemas) {
      this.generateInterfaceFile(schema, false, generatedInterfaces);
    }
    this.generateInterfacesIndexFile(generatedInterfaces);
  }

  private generateInterfaceFile(
    schema: MongoJsonSchemaTypeObject,
    isEmbedded: boolean,
    generatedInterfaces: GeneratedInterfaceSets
  ): void {
    const entityName = getEntityName(
      this.interfaceOptions.prefix,
      schema.title
    );

    if (isInterfaceAlreadyGenerated(generatedInterfaces, entityName)) {
      return;
    }

    addGeneratedInterface(generatedInterfaces, entityName, isEmbedded);

    const filePath = InterfaceCodeGeneratorBase.getCollectionInterfaceFilePath(
      entityName,
      this.getInterfacesDir(),
      isEmbedded
    );

    const sf = this.project.createSourceFile(filePath);

    const interfaceDeclaration = sf.addInterface({
      name: entityName,
      isExported: true,
    });

    const propertyEntries = objectGetEntries(schema.properties);
    const requiredSet = new Set(
      schema.required.map((name) => this.getPropertyName(name))
    );
    const propertyResults = propertyEntries.map((property) =>
      this.getPropertySignatureAndGenerateNestedTypeInterfaces(
        property,
        requiredSet,
        generatedInterfaces
      )
    );
    const propertySignatures = propertyResults.map((r) => r.propertyType);
    interfaceDeclaration.addProperties(propertySignatures);

    const propertyValueTypes = propertyResults.map((r) => r.valueTypeResult);
    this.addImports(sf, propertyValueTypes, isEmbedded);
  }

  private getInterfacesDir(): string {
    return path.join(
      this.pathResolver.resolveSharedProjectInterfacesRootDir(),
      this.interfaceOptions.dir
    );
  }

  private getPropertySignatureAndGenerateNestedTypeInterfaces(
    property: ObjectEntry<ReadonlyRecord<string, MongoJsonSchemaAnyType>>,
    requiredPropertiesSet: Set<string>,
    generatedInterfaces: GeneratedInterfaceSets
  ): GetPropertySignatureResult {
    const propertyName = this.getPropertyName(property.key);
    const propertyDef = property.value;
    const propertyValueTypeResult =
      this.getValueTypeAndGenerateNestedTypeInterfaces(
        propertyDef,
        false,
        generatedInterfaces
      );
    const propertySignature: OptionalKind<PropertySignatureStructure> = {
      name: propertyName,
      isReadonly: true,
      type: propertyValueTypeResult.type,
      hasQuestionToken: !requiredPropertiesSet.has(propertyName),
    };

    return {
      valueTypeResult: propertyValueTypeResult,
      propertyType: propertySignature,
    };
  }

  getValueTypeAndGenerateNestedTypeInterfaces(
    schema: MongoJsonSchemaAnyType,
    isInArray: boolean,
    generatedInterfaces: GeneratedInterfaceSets
  ): GetValueTypeResult {
    const type = schema.bsonType;
    if (type === 'object') {
      this.generateInterfaceFile(schema, true, generatedInterfaces);
      const type = getEntityName(this.interfaceOptions.prefix, schema.title);
      return {
        type,
        typeForImport: type,
        importModuleType: 'local',
      };
    } else if (type === 'array') {
      const itemResult = this.getValueTypeAndGenerateNestedTypeInterfaces(
        schema.items,
        true,
        generatedInterfaces
      );
      const fullArrayType = `readonly ${itemResult.type}[]`;
      return {
        type: isInArray ? `(${fullArrayType})` : fullArrayType,
        typeForImport: itemResult.type,
        importModuleType: itemResult.importModuleType,
      };
    } else {
      return this.getSimpleValueTypeMapping(schema.bsonType);
    }
  }

  private generateInterfacesIndexFile(
    generatedInterfaces: GeneratedInterfaceSets
  ): void {
    const interfacesDir = this.getInterfacesDir();

    const embedded = sortArrayByStringAsc(
      Array.from(generatedInterfaces.embedded)
    );
    const collections = sortArrayByStringAsc(
      Array.from(generatedInterfaces.collections)
    );

    const hasEmbedded = embedded.length > 0;
    const hasCollections = collections.length > 0;

    if (hasEmbedded) {
      const embeddedIndexFile = path.join(interfacesDir, 'embedded/index.ts');

      const embeddedIndexSf = this.project.createSourceFile(embeddedIndexFile);

      embeddedIndexSf.addExportDeclarations(
        embedded.map((name) => ({
          moduleSpecifier: `./${kebabCase(name)}`,
        }))
      );
    }

    if (hasEmbedded || hasCollections) {
      const collectionsIndexFile = path.join(interfacesDir, 'index.ts');

      const collectionsIndexSf =
        this.project.createSourceFile(collectionsIndexFile);

      if (hasEmbedded) {
        collectionsIndexSf.addExportDeclaration({
          moduleSpecifier: './embedded',
        });
      }

      collectionsIndexSf.addExportDeclarations(
        collections.map((name) => ({
          moduleSpecifier: `./${kebabCase(name)}`,
        }))
      );
    }
  }

  private addImports(
    sf: SourceFile,
    propertyValueTypes: readonly GetValueTypeResult[],
    isEmbedded: boolean
  ): void {
    const localImports = InterfaceCodeGeneratorBase.getImportSpecifiers(
      propertyValueTypes,
      'local'
    );

    if (localImports.length > 0) {
      if (!isEmbedded) {
        sf.insertImportDeclaration(0, {
          namedImports: [...localImports],
          moduleSpecifier: './embedded',
        });
      } else {
        sf.insertImportDeclarations(
          0,
          localImports.map((li) => ({
            namedImports: [li],
            moduleSpecifier: `./${kebabCase(li.name)}`,
          }))
        );
      }
    }

    const mongoImports = InterfaceCodeGeneratorBase.getImportSpecifiers(
      propertyValueTypes,
      'mongo'
    );

    if (mongoImports.length > 0) {
      sf.insertImportDeclaration(0, {
        namedImports: [...mongoImports],
        moduleSpecifier: 'mongodb',
      });
    }
  }

  private static getCollectionInterfaceFilePath(
    entityName: string,
    interfacesDir: string,
    isEmbedded: boolean
  ): string {
    const fileName = `${kebabCase(entityName)}.ts`;
    return path.join(interfacesDir, isEmbedded ? 'embedded' : '', fileName);
  }

  private static getImportSpecifiers(
    propertyValueTypes: readonly GetValueTypeResult[],
    importModuleType: InterfacePropertyImportModuleType
  ): readonly OptionalKind<ImportSpecifierStructure>[] {
    return asChainable(propertyValueTypes)
      .filter((p) => p.importModuleType === importModuleType)
      .map((p) => p.typeForImport)
      .apply(distinctItems)
      .apply(sortArrayByStringAsc)
      .map<string, OptionalKind<ImportSpecifierStructure>>((t) => ({
        name: t,
      }))
      .getValue();
  }

  protected abstract get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions;

  protected abstract getPropertyName(initialPropertyName: string): string;

  protected abstract getSimpleValueTypeMapping(
    type: MongoJsonSchemaBsonType
  ): GetValueTypeResult;
}

class InterfaceCodeGeneratorDb extends InterfaceCodeGeneratorBase {
  public constructor(
    input: GenerateMongoCodeFromSchemaInput,
    project: Project,
    pathResolver: PathResolver
  ) {
    super(input, project, pathResolver);
  }

  protected get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions {
    return this.input.options.appsMonorepo.dbInterfaceOptions;
  }

  protected getPropertyName(initialPropertyName: string): string {
    return initialPropertyName;
  }

  protected getSimpleValueTypeMapping(
    type: MongoJsonSchemaBsonType
  ): GetValueTypeResult {
    const mongoTypes: readonly MongoJsonSchemaBsonType[] = [
      'objectId',
      'decimal',
    ];
    const simpleType =
      InterfaceCodeGeneratorDb.getSimpleValueTypeMappingInternal(type);
    return {
      type: simpleType,
      typeForImport: simpleType,
      importModuleType: mongoTypes.includes(type) ? 'mongo' : 'none',
    };
  }

  private static getSimpleValueTypeMappingInternal(
    type: MongoJsonSchemaBsonType
  ): string {
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
    pathResolver: PathResolver
  ) {
    super(input, project, pathResolver);
  }

  protected get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions {
    return this.input.options.appsMonorepo.appInterfaceOptions;
  }

  protected getPropertyName(initialPropertyName: string): string {
    return initialPropertyName.replace(/^_+|_+$/g, '');
  }

  protected getSimpleValueTypeMapping(
    type: MongoJsonSchemaBsonType
  ): GetValueTypeResult {
    const simpleType =
      InterfaceCodeGeneratorApp.getSimpleValueTypeMappingInternal(type);
    return {
      type: simpleType,
      typeForImport: simpleType,
      importModuleType: 'none',
    };
  }

  private static getSimpleValueTypeMappingInternal(
    type: MongoJsonSchemaBsonType
  ): string {
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

interface GeneratedInterfaceSets {
  readonly collections: Set<string>;
  readonly embedded: Set<string>;
}

function isInterfaceAlreadyGenerated(
  sets: GeneratedInterfaceSets,
  name: string
): boolean {
  return sets.collections.has(name) || sets.embedded.has(name);
}

function addGeneratedInterface(
  sets: GeneratedInterfaceSets,
  name: string,
  isEmbedded: boolean
): void {
  if (isEmbedded) {
    sets.embedded.add(name);
  } else {
    sets.collections.add(name);
  }
}

type InterfacePropertyImportModuleType = 'mongo' | 'local' | 'none';

interface GetValueTypeResult {
  readonly type: string;
  readonly typeForImport: string;
  readonly importModuleType: InterfacePropertyImportModuleType;
}

interface GetPropertySignatureResult {
  readonly propertyType: OptionalKind<PropertySignatureStructure>;
  readonly valueTypeResult: GetValueTypeResult;
}

function getEntityName(prefix: string, name: string): string {
  return pascalCase(prefix + pascalCase(name));
}
