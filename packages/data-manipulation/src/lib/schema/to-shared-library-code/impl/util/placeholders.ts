import { ImmutableMap } from '@gmjs/util';

// there is some performance issue with source code generation when it contains a 'type-fest' import
// therefore I import with a placeholder which I then replace here

export const PLACEHOLDER_MODULE_NAME_TYPE_FEST = '<<module-name-type-fest>>';
export const PLACEHOLDER_MODULE_NAME_NESTJS_COMMON =
  '<<module-name-nestjs-common>>';

export const PLACEHOLDER_MAP = ImmutableMap.fromTupleArray([
  [PLACEHOLDER_MODULE_NAME_TYPE_FEST, 'type-fest'],
  [PLACEHOLDER_MODULE_NAME_NESTJS_COMMON, '@nestjs/common'],
]);
