import { ValueOf } from 'type-fest';
import { StringEnumLike } from '../types/generic';

export function getEnumValues<T extends StringEnumLike>(
  enumType: T
): readonly ValueOf<T>[] {
  return Object.values(enumType) as unknown as readonly ValueOf<T>[];
}
