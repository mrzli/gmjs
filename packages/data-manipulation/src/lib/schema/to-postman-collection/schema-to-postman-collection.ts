import {
  PostmanCollection,
  PostmanCollectionBody,
  PostmanCollectionItemFolder,
  PostmanCollectionItemRequest,
  PostmanCollectionUrl,
  PostmanCollectionUrlVariable,
} from './postman-collection';
import { SchemaToPostmanCollectionInput } from './schema-to-postman-collection-input';
import { capitalCase, jsonToPretty, kebabCase } from '@gmjs/lib-util';
import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { schemaToJsonData } from '../to-json-data/schema-to-json-data';
import { objectOmitFields } from '@gmjs/util';

export function schemaToPostmanCollection(
  input: SchemaToPostmanCollectionInput
): PostmanCollection {
  const schemas = input.schemas;

  const postmanCollectionDisplayName = capitalCase(input.postmanCollectionName);
  const postmanFolders = schemas.map(getEntityPostmanFolder);

  return {
    info: {
      name: postmanCollectionDisplayName,
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [
      {
        name: postmanCollectionDisplayName,
        item: postmanFolders,
      },
    ],
  };
}

const URL_VAR_NAME = 'base_url';
const URL_VAR_STRING = `{{${URL_VAR_NAME}}}`;
const API_PREFIX = 'api';

function getEntityPostmanFolder(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemFolder {
  const displayName = getEntityDisplayName(schema);

  return {
    name: displayName,
    item: [
      createFindAllRequest(schema),
      createFindRequest(schema),
      createCreateRequest(schema),
      createUpdateRequest(schema),
      createDeleteRequest(schema),
    ],
  };
}

function createFindAllRequest(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(schema);

  return {
    name: `${entityDisplayName} - Find All`,
    request: {
      method: 'GET',
      url: createUrl(schema, ['find-all']),
      header: [],
    },
    response: [],
  };
}

function createFindRequest(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(schema);

  return {
    name: `${entityDisplayName} - Find`,
    request: {
      method: 'GET',
      url: createUrl(schema, ['find', ':id']),
      header: [],
    },
    response: [],
  };
}

function createCreateRequest(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(schema);

  return {
    name: `${entityDisplayName} - Create`,
    request: {
      method: 'POST',
      url: createUrl(schema, ['create']),
      header: [],
      body: createBody(schema, false),
    },
    response: [],
  };
}

function createUpdateRequest(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(schema);

  return {
    name: `${entityDisplayName} - Update`,
    request: {
      method: 'POST',
      url: createUrl(schema, ['update', ':id']),
      header: [],
      body: createBody(schema, true),
    },
    response: [],
  };
}

function createDeleteRequest(
  schema: MongoJsonSchemaTypeObject
): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(schema);

  return {
    name: `${entityDisplayName} - Delete`,
    request: {
      method: 'DELETE',
      url: createUrl(schema, ['remove', ':id']),
      header: [],
    },
    response: [],
  };
}

function getEntityDisplayName(schema: MongoJsonSchemaTypeObject): string {
  return capitalCase(schema.title);
}

function createUrl(
  schema: MongoJsonSchemaTypeObject,
  pathSegments: readonly string[]
): PostmanCollectionUrl {
  const entityPathName = kebabCase(schema.title);

  const path: readonly string[] = [
    API_PREFIX,
    entityPathName,
    ...pathSegments,
  ].filter((item) => item !== '');
  const raw = URL_VAR_STRING + path.join('/');

  const variables: readonly PostmanCollectionUrlVariable[] = pathSegments
    .filter((s) => s.startsWith(':'))
    .map((item) => ({
      key: item,
      value: '',
    }));

  return {
    raw,
    host: [URL_VAR_STRING],
    path,
    variable: variables,
  };
}

function createBody(
  schema: MongoJsonSchemaTypeObject,
  omitId: boolean
): PostmanCollectionBody {
  const bodyJson = schemaToJsonData(schema);
  const finalBodyJson = omitId ? objectOmitFields(bodyJson, ['id']) : bodyJson;

  return {
    mode: 'raw',
    raw: jsonToPretty(finalBodyJson),
    options: {
      raw: {
        language: 'json',
      },
    },
  };
}
