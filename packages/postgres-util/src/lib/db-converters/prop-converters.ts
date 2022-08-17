import { transformIfExists } from '@gmjs/util';
import { NULL, quoteValue } from './util';

export function propIdAppToDb(value: string): string {
  return value;
}

export function propIdOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, propIdAppToDb);
}

export function propStringAppToDb(value: string): string {
  return quoteValue(value);
}

export function propStringOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, propStringAppToDb);
}

export function propIntegerAppToDb(value: number): string {
  return value.toString();
}

export function propIntegerOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, propIntegerAppToDb);
}

export function propLongAppToDb(value: number): string {
  return value.toString();
}

export function propLongOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, propLongAppToDb);
}

export function propFloatAppToDb(value: number): string {
  return value.toString();
}

export function propFloatOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, propFloatAppToDb);
}

export function propDoubleAppToDb(value: number): string {
  return value.toString();
}

export function propDoubleOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, propDoubleAppToDb);
}

export function propDecimalAppToDb(value: string): string {
  return value;
}

export function propDecimalOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, propDecimalAppToDb);
}

export function propBooleanAppToDb(value: boolean): string {
  return value ? 'TRUE' : 'FALSE';
}

export function propBooleanOptionalAppToDb(value: boolean | undefined): string {
  return transformIfExistsOrDbNull(value, propBooleanAppToDb);
}

export function propDateAppToDb(value: string): string {
  return quoteValue(value);
}

export function propDateOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, propDateAppToDb);
}

function transformIfExistsOrDbNull<T>(
  value: T | undefined,
  transformer: (input: T) => string
): string {
  return transformIfExists(value, transformer, undefined) ?? NULL;
}
