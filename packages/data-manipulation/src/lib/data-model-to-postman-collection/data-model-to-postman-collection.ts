import * as fs from 'fs-extra';
import {
  PostmanCollection,
  PostmanCollectionBody,
  PostmanCollectionItemFolder,
  PostmanCollectionItemRequest,
  PostmanCollectionUrl,
  PostmanCollectionUrlVariable,
} from './postman-collection';
import { DataModelToPostmanCollectionInput } from './data-model-to-postman-collection-input';
import { parseDataModelYaml } from '../data-model-shared/data-model-util';
import { AnyValue } from '@gmjs/util';
import { capitalCase, jsonToPretty, kebabCase } from '@gmjs/lib-util';

export function dataModelToPostmanCollection(
  input: DataModelToPostmanCollectionInput
): PostmanCollection {
  const dataModel = parseDataModelYaml(input.dataModelYamlContent);

  const postmanCollectionDisplayName = capitalCase(input.postmanCollectionName);
  const entities: readonly AnyValue[] = dataModel.collections;
  const postmanFolders = entities.map(getEntityPostmanFolder);

  const result: PostmanCollection = {
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

  fs.ensureDirSync('output');
  fs.writeFileSync('output/postman.json', jsonToPretty(result));

  return result;
}

const URL_VAR_NAME = 'base_url';
const URL_VAR_STRING = `{{${URL_VAR_NAME}}}`;
const API_PREFIX = 'api';

function getEntityPostmanFolder(entity: AnyValue): PostmanCollectionItemFolder {
  const displayName = getEntityDisplayName(entity);

  return {
    name: displayName,
    item: [
      createFindAllRequest(entity),
      createFindRequest(entity),
      createCreateRequest(entity),
      createUpdateRequest(entity),
      createDeleteRequest(entity),
    ],
  };
}

function createFindAllRequest(entity: AnyValue): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(entity);

  return {
    name: `${entityDisplayName} - Find All`,
    request: {
      method: 'GET',
      url: createUrl(entity, ['find-all']),
      header: [],
    },
    response: [],
  };
}

function createFindRequest(entity: AnyValue): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(entity);

  return {
    name: `${entityDisplayName} - Find`,
    request: {
      method: 'GET',
      url: createUrl(entity, ['find', ':id']),
      header: [],
    },
    response: [],
  };
}

function createCreateRequest(entity: AnyValue): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(entity);

  return {
    name: `${entityDisplayName} - Create`,
    request: {
      method: 'POST',
      url: createUrl(entity, ['create']),
      header: [],
      body: createBody(entity),
    },
    response: [],
  };
}

function createUpdateRequest(entity: AnyValue): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(entity);

  return {
    name: `${entityDisplayName} - Update`,
    request: {
      method: 'POST',
      url: createUrl(entity, ['update', ':id']),
      header: [],
      body: createBody(entity),
    },
    response: [],
  };
}

function createDeleteRequest(entity: AnyValue): PostmanCollectionItemRequest {
  const entityDisplayName = getEntityDisplayName(entity);

  return {
    name: `${entityDisplayName} - Delete`,
    request: {
      method: 'DELETE',
      url: createUrl(entity, ['remove', ':id']),
      header: [],
      body: createBody(entity),
    },
    response: [],
  };
}

function getEntityDisplayName(entity: AnyValue): string {
  return capitalCase(entity.name);
}

function createUrl(
  entity: AnyValue,
  pathSegments: readonly string[]
): PostmanCollectionUrl {
  const entityPathName = kebabCase(entity.name);

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

function createBody(_entity: AnyValue): PostmanCollectionBody {
  return {
    mode: 'raw',
    raw: '',
    options: {
      raw: {
        language: 'json',
      },
    },
  };
}
