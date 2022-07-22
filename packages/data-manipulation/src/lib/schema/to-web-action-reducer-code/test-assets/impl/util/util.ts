import {
  constantCase,
  constantCaseJoined,
  pascalCase,
  pascalCaseJoined,
} from '@gmjs/lib-util';
import { flatMap } from '@gmjs/util';

const API_CALL_ACTION_TYPE_LIST = [
  'Base',
  'Pending',
  'Fulfilled',
  'Rejected',
] as const;

export type EndpointName =
  | 'getAll'
  | 'getById'
  | 'create'
  | 'update'
  | 'remove';

export type ApiCallActionType = typeof API_CALL_ACTION_TYPE_LIST[number];

export const ACTION_TYPE_CONSTANT_PREFIX = 'ACTION_TYPE';
export const ACTION_TYPE_PREFIX = 'ActionType';
export const ACTION_PREFIX = 'Action';
export const ACTION_FUNCTION_PREFIX = 'action';

export interface ActionValues {
  readonly endpointName: EndpointName;
  readonly apiCallActionType: ApiCallActionType;
  readonly actionTypeStringValue: string;
  readonly actionTypeConstant: string;
  readonly actionTypeName: string;
  readonly actionName: string;
  readonly actionCreateFunctionName: string;
  readonly payloadType: string;
}

export function getEndpointAllActionValues(
  entityBaseName: string,
  typeName: string
): readonly ActionValues[] {
  const endpointList = getEndpointList(typeName);

  return flatMap(endpointList, (ed) =>
    getEndpointActionValues(entityBaseName, typeName, ed)
  );
}

function getEndpointActionValues(
  entityBaseName: string,
  typeName: string,
  endpointData: EndpointData
): readonly ActionValues[] {
  return API_CALL_ACTION_TYPE_LIST.map((acActionType) =>
    getEndpointSingleActionValues(
      entityBaseName,
      typeName,
      endpointData,
      acActionType
    )
  );
}

interface EndpointData {
  readonly name: EndpointName;
  readonly basePayloadType: string;
  readonly fulfilledPayloadType: string;
}

function getEndpointList(typeName: string): readonly EndpointData[] {
  return [
    {
      name: 'getAll',
      basePayloadType: 'undefined',
      fulfilledPayloadType: `readonly ${typeName}[]`,
    },
    {
      name: 'getById',
      basePayloadType: 'string',
      fulfilledPayloadType: typeName,
    },
    {
      name: 'create',
      basePayloadType: `WithoutId<${typeName}>`,
      fulfilledPayloadType: typeName,
    },
    {
      name: 'update',
      basePayloadType: typeName,
      fulfilledPayloadType: typeName,
    },
    {
      name: 'remove',
      basePayloadType: 'string',
      fulfilledPayloadType: 'string',
    },
  ];
}

function getEndpointSingleActionValues(
  entityBaseName: string,
  typeName: string,
  endpointData: EndpointData,
  apiCallActionType: ApiCallActionType
): ActionValues {
  const actionTypeConstant = getActionTypeConstant(
    entityBaseName,
    endpointData.name,
    apiCallActionType
  );

  const actionBaseName = pascalCaseJoined(entityBaseName, endpointData.name);
  const typeSuffix = getApiCallActionTypeSuffix(apiCallActionType);
  const actionNameWithSuffix = pascalCaseJoined(actionBaseName, typeSuffix);
  const actionTypeName = `${ACTION_TYPE_PREFIX}${actionNameWithSuffix}`;
  const actionName = `${ACTION_PREFIX}${actionNameWithSuffix}`;
  const actionCreateFunctionName = `${ACTION_FUNCTION_PREFIX}${actionNameWithSuffix}`;

  const payloadType = getPayloadType(endpointData, apiCallActionType);

  return {
    endpointName: endpointData.name,
    apiCallActionType,
    actionTypeStringValue: actionNameWithSuffix,
    actionTypeConstant,
    actionTypeName,
    actionName,
    actionCreateFunctionName,
    payloadType,
  };
}

function getActionTypeConstant(
  entityBaseName: string,
  actionEndpointName: string,
  apiCallActionType: ApiCallActionType
): string {
  const suffix = getApiCallActionConstantSuffix(apiCallActionType);
  return constantCaseJoined(
    ACTION_TYPE_CONSTANT_PREFIX,
    entityBaseName,
    actionEndpointName,
    suffix
  );
}

function getApiCallActionConstantSuffix(type: ApiCallActionType): string {
  return type === 'Base' ? '' : constantCase(type);
}

function getApiCallActionTypeSuffix(type: ApiCallActionType): string {
  return type === 'Base' ? '' : pascalCase(type);
}

function getPayloadType(
  endpointData: EndpointData,
  apiCallActionType: ApiCallActionType
): string {
  switch (apiCallActionType) {
    case 'Base':
      return endpointData.basePayloadType;
    case 'Pending':
      return 'undefined';
    case 'Fulfilled':
      return endpointData.fulfilledPayloadType;
    case 'Rejected':
      return 'undefined';
  }
}
