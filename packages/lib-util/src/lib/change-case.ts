import { CamelCase, KebabCase, PascalCase } from 'type-fest';
import {
  camelCase as _camelCase,
  paramCase as _paramCase,
  pascalCase as _pascalCase,
} from 'change-case';

export function kebabCase<T extends string>(value: T): KebabCase<T> {
  return _paramCase(value) as KebabCase<T>;
}

export function pascalCase<T extends string>(value: T): PascalCase<T> {
  return _pascalCase(value) as PascalCase<T>;
}

export function camelCase<T extends string>(value: T): CamelCase<T> {
  return _camelCase(value) as CamelCase<T>;
}
