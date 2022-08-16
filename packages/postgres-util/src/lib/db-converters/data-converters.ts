import { transformIfExists } from '@gmjs/util';

const NULL = 'NULL';

export function pgIdAppToDb(value: string): string {
  return value;
}

export function pgIdOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, pgIdAppToDb);
}

export function pgStringAppToDb(value: string): string {
  return `'${value}'`;
}

export function pgStringOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, pgStringAppToDb);
}

export function pgIntegerAppToDb(value: number): string {
  return value.toString();
}

export function pgIntegerOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, pgIntegerAppToDb);
}

export function pgLongAppToDb(value: number): string {
  return value.toString();
}

export function pgLongOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, pgLongAppToDb);
}

export function pgFloatAppToDb(value: number): string {
  return value.toString();
}

export function pgFloatOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, pgFloatAppToDb);
}

export function pgDoubleAppToDb(value: number): string {
  return value.toString();
}

export function pgDoubleOptionalAppToDb(value: number | undefined): string {
  return transformIfExistsOrDbNull(value, pgDoubleAppToDb);
}

export function pgDecimalAppToDb(value: string): string {
  return value;
}

export function pgDecimalOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, pgDecimalAppToDb);
}

export function pgBooleanAppToDb(value: boolean): string {
  return value ? 'TRUE' : 'FALSE';
}

export function pgBooleanOptionalAppToDb(value: boolean | undefined): string {
  return transformIfExistsOrDbNull(value, pgBooleanAppToDb);
}

export function pgDateAppToDb(value: string): string {
  return `'${value}'`;
}

export function pgDateOptionalAppToDb(value: string | undefined): string {
  return transformIfExistsOrDbNull(value, pgDateAppToDb);
}

function transformIfExistsOrDbNull<T>(
  value: T | undefined,
  transformer: (input: T) => string
): string {
  return transformIfExists(value, transformer, undefined) ?? NULL;
}
