import {
  GenerateMongoCodeFromSchemaInput,
  GenerateMongoCodeFromSchemaInterfaceOptions,
} from '../util/types';
import {
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
import { invariant, objectGetEntries, sortArrayByStringAsc } from '@gmjs/util';
import { getRelativeImportPath } from '../util/util';

export interface InterfaceCodeGenerator {
  generateInterfacesCode(): void;
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

  public generateInterfacesCode(): void {
    const interfacesDir = path.join(
      this.pathResolver.resolveSharedProjectInterfacesRootDir(),
      this.interfaceOptions.dir
    );
    const filePaths = this.generateInterfaceFiles(interfacesDir);
    const interfacesIndexFile = path.join(interfacesDir, 'index.ts');
    const indexSf = this.project.createSourceFile(interfacesIndexFile);
    indexSf.addExportDeclarations(
      filePaths.map((p) => ({
        moduleSpecifier: getRelativeImportPath(interfacesIndexFile, p),
      }))
    );
  }

  private generateInterfaceFiles(interfacesDir: string): readonly string[] {
    const filePaths: string[] = [];
    for (const schema of this.input.schemas) {
      const entityName = getEntityName(
        this.interfaceOptions.prefix,
        schema.title
      );
      const fileName = `${kebabCase(entityName)}.ts`;
      const filePath = path.join(interfacesDir, fileName);
      const sf = this.project.createSourceFile(filePath);
      this.addImports(sf, schema);
      this.addInterface(sf, schema);
      filePaths.push(filePath);
    }

    return filePaths;
  }

  private addInterface(
    sf: SourceFile,
    schema: MongoJsonSchemaTypeObject
  ): void {
    const entityName = getEntityName(
      this.interfaceOptions.prefix,
      schema.title
    );
    const interfaceDeclaration = sf.addInterface({
      name: entityName,
      isExported: true,
    });

    const propertyDeclarations: OptionalKind<PropertySignatureStructure>[] = [];
    const propertyEntries = objectGetEntries(schema.properties);
    const requiredSet = new Set(
      schema.required.map((name) => this.getPropertyName(name))
    );
    for (const property of propertyEntries) {
      const propertyName = this.getPropertyName(property.key);
      const propertyDef = property.value;
      const propertyType = this.getValueTypeAndAddEmbeddedTypeInterfaces(
        sf,
        propertyDef,
        false
      );
      propertyDeclarations.push({
        name: propertyName,
        isReadonly: true,
        type: propertyType,
        hasQuestionToken: !requiredSet.has(propertyName),
      });
    }

    interfaceDeclaration.addProperties(propertyDeclarations);
  }

  private getValueTypeAndAddEmbeddedTypeInterfaces(
    sf: SourceFile,
    schema: MongoJsonSchemaAnyType,
    isInArray: boolean
  ): string {
    const type = schema.bsonType;
    if (type === 'object') {
      this.addInterface(sf, schema);
      return getEntityName(this.interfaceOptions.prefix, schema.title);
    } else if (type === 'array') {
      const itemType = this.getValueTypeAndAddEmbeddedTypeInterfaces(
        sf,
        schema.items,
        true
      );
      const fullArrayType = `readonly ${itemType}[]`;
      return isInArray ? `(${fullArrayType})` : fullArrayType;
    } else {
      return this.getSimpleValueTypeMapping(schema.bsonType);
    }
  }

  protected abstract get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions;

  protected abstract addImports(
    sf: SourceFile,
    schema: MongoJsonSchemaTypeObject
  ): void;

  protected abstract getPropertyName(initialPropertyName: string): string;

  protected abstract getSimpleValueTypeMapping(
    type: MongoJsonSchemaBsonType
  ): string;
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

  protected addImports(
    sf: SourceFile,
    schema: MongoJsonSchemaTypeObject
  ): void {
    const mongoImports = InterfaceCodeGeneratorDb.getMongoImports(schema);
    sf.addImportDeclaration({
      namedImports: mongoImports.map((mi) => ({ name: mi })),
      moduleSpecifier: 'mongodb',
    });
  }

  private static getMongoImports(
    schema: MongoJsonSchemaTypeObject
  ): readonly string[] {
    const mongoImports = new Set<string>();
    InterfaceCodeGeneratorDb.getMongoImportsObject(schema, mongoImports);
    return sortArrayByStringAsc(Array.from(mongoImports.values()));
  }

  private static getMongoImportsAnyType(
    schema: MongoJsonSchemaAnyType,
    mongoImports: Set<string>
  ): void {
    switch (schema.bsonType) {
      case 'object':
        InterfaceCodeGeneratorDb.getMongoImportsObject(schema, mongoImports);
        break;
      case 'array':
        InterfaceCodeGeneratorDb.getMongoImportsAnyType(
          schema.items,
          mongoImports
        );
        break;
      case 'decimal':
        mongoImports.add('Decimal128');
        break;
      case 'objectId':
        mongoImports.add('ObjectId');
        break;
    }
  }

  private static getMongoImportsObject(
    schema: MongoJsonSchemaTypeObject,
    mongoImports: Set<string>
  ): void {
    const properties = Object.values(schema.properties);
    for (const prop of properties) {
      InterfaceCodeGeneratorDb.getMongoImportsAnyType(prop, mongoImports);
    }
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
    pathResolver: PathResolver
  ) {
    super(input, project, pathResolver);
  }

  protected get interfaceOptions(): GenerateMongoCodeFromSchemaInterfaceOptions {
    return this.input.options.appsMonorepo.appInterfaceOptions;
  }

  protected addImports(
    _sf: SourceFile,
    _schema: MongoJsonSchemaTypeObject
  ): void {}

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
