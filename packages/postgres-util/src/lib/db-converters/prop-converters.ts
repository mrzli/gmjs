import { transformIfExists } from '@gmjs/util';
import { NULL, quoteValue } from './util';

// db-to-app
export function propIdDbToApp(value: string): string {
  return value;
}

export function propIdOptionalDbToApp(
  value: string | null
): string | undefined {
  return transformIfExistsFromDbOrUndefined(value, propIdDbToApp);
}

export function propStringDbToApp(value: string): string {
  return value;
}

export function propStringOptionalDbToApp(
  value: string | null
): string | undefined {
  return transformIfExistsFromDbOrUndefined(value, propStringDbToApp);
}

export function propIntegerDbToApp(value: number): number {
  return value;
}

export function propIntegerOptionalDbToApp(
  value: number | null
): number | undefined {
  return transformIfExistsFromDbOrUndefined(value, propIntegerDbToApp);
}

export function propLongDbToApp(value: string): number {
  return Number.parseInt(value);
}

export function propLongOptionalDbToApp(
  value: string | null
): number | undefined {
  return transformIfExistsFromDbOrUndefined(value, propLongDbToApp);
}

export function propFloatDbToApp(value: number): number {
  return value;
}

export function propFloatOptionalDbToApp(
  value: number | null
): number | undefined {
  return transformIfExistsFromDbOrUndefined(value, propFloatDbToApp);
}

export function propDoubleDbToApp(value: number): number {
  return value;
}

export function propDoubleOptionalDbToApp(
  value: number | null
): number | undefined {
  return transformIfExistsFromDbOrUndefined(value, propDoubleDbToApp);
}

export function propDecimalDbToApp(value: string): string {
  return value;
}

export function propDecimalOptionalDbToApp(
  value: string | null
): string | undefined {
  return transformIfExistsFromDbOrUndefined(value, propDecimalDbToApp);
}

export function propBooleanDbToApp(value: boolean): boolean {
  return value;
}

export function propBooleanOptionalDbToApp(
  value: boolean | null
): boolean | undefined {
  return transformIfExistsFromDbOrUndefined(value, propBooleanDbToApp);
}

export function propDateDbToApp(value: Date): string {
  return value.toISOString();
}

export function propDateOptionalDbToApp(
  value: Date | null
): string | undefined {
  return transformIfExistsFromDbOrUndefined(value, propDateDbToApp);
}
// end db-to-app

// app-to-db
export function propIdAppToDb(value: string): string {
  return quoteValue(value);
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
// end app-to-db

function transformIfExistsFromDbOrUndefined<T, U>(
  value: T | null,
  transformer: (input: T) => U
): U | undefined {
  return transformIfExists(value, transformer, null) ?? undefined;
}

function transformIfExistsOrDbNull<T>(
  value: T | undefined,
  transformer: (input: T) => string
): string {
  return transformIfExists(value, transformer, undefined) ?? NULL;
}
