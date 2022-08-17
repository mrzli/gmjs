import { transformIfExists } from '@gmjs/util';
import { Decimal128, Double, Long, ObjectId } from 'mongodb';

// db-to-app
export function propIdDbToApp(value: ObjectId): string {
  return value.toString();
}

export function propIdOptionalDbToApp(
  value: ObjectId | undefined
): string | undefined {
  return transformIfExists(value, propIdDbToApp, undefined);
}

export function propStringDbToApp(value: string): string {
  return value;
}

export function propStringOptionalDbToApp(
  value: string | undefined
): string | undefined {
  return transformIfExists(value, propStringDbToApp, undefined);
}

export function propIntegerDbToApp(value: number): number {
  return value;
}

export function propIntegerOptionalDbToApp(
  value: number | undefined
): number | undefined {
  return transformIfExists(value, propIntegerDbToApp, undefined);
}

export function propLongDbToApp(value: Long): number {
  return value.toInt();
}

export function propLongOptionalDbToApp(
  value: Long | undefined
): number | undefined {
  return transformIfExists(value, propLongDbToApp, undefined);
}

export function propFloatDbToApp(value: number): number {
  return value;
}

export function propFloatOptionalDbToApp(
  value: number | undefined
): number | undefined {
  return transformIfExists(value, propFloatDbToApp, undefined);
}

export function propDoubleDbToApp(value: Double): number {
  return value.valueOf();
}

export function propDoubleOptionalDbToApp(
  value: Double | undefined
): number | undefined {
  return transformIfExists(value, propDoubleDbToApp, undefined);
}

export function propDecimalDbToApp(value: Decimal128): string {
  return value.toString();
}

export function propDecimalOptionalDbToApp(
  value: Decimal128 | undefined
): string | undefined {
  return transformIfExists(value, propDecimalDbToApp, undefined);
}

export function propBooleanDbToApp(value: boolean): boolean {
  return value;
}

export function propBooleanOptionalDbToApp(
  value: boolean | undefined
): boolean | undefined {
  return transformIfExists(value, propBooleanDbToApp, undefined);
}

export function propDateDbToApp(value: Date): string {
  return value.toISOString();
}

export function propDateOptionalDbToApp(
  value: Date | undefined
): string | undefined {
  return transformIfExists(value, propDateDbToApp, undefined);
}
// end db-to-app

// app-to-db
export function propIdAppToDb(value: string): ObjectId {
  return new ObjectId(value);
}

export function propIdOptionalAppToDb(
  value: string | undefined
): ObjectId | undefined {
  return transformIfExists(value, propIdAppToDb, undefined);
}

export function propStringAppToDb(value: string): string {
  return value;
}

export function propStringOptionalAppToDb(
  value: string | undefined
): string | undefined {
  return transformIfExists(value, propStringAppToDb, undefined);
}

export function propIntegerAppToDb(value: number): number {
  return value;
}

export function propIntegerOptionalAppToDb(
  value: number | undefined
): number | undefined {
  return transformIfExists(value, propIntegerAppToDb, undefined);
}

export function propLongAppToDb(value: number): Long {
  return new Long(value);
}

export function propLongOptionalAppToDb(
  value: number | undefined
): Long | undefined {
  return transformIfExists(value, propLongAppToDb, undefined);
}

export function propFloatAppToDb(value: number): number {
  return value;
}

export function propFloatOptionalAppToDb(
  value: number | undefined
): number | undefined {
  return transformIfExists(value, propFloatAppToDb, undefined);
}

export function propDoubleAppToDb(value: number): Double {
  return new Double(value);
}

export function propDoubleOptionalAppToDb(
  value: number | undefined
): Double | undefined {
  return transformIfExists(value, propDoubleAppToDb, undefined);
}

export function propDecimalAppToDb(value: string): Decimal128 {
  return new Decimal128(value);
}

export function propBooleanAppToDb(value: boolean): boolean | undefined {
  return value;
}

export function propBooleanOptionalAppToDb(
  value: boolean | undefined
): boolean | undefined {
  return transformIfExists(value, propBooleanAppToDb, undefined);
}

export function propDecimalOptionalAppToDb(
  value: string | undefined
): Decimal128 | undefined {
  return transformIfExists(value, propDecimalAppToDb, undefined);
}

export function propDateAppToDb(value: string): Date {
  return new Date(value);
}

export function propDateOptionalAppToDb(
  value: string | undefined
): Date | undefined {
  return transformIfExists(value, propDateAppToDb, undefined);
}
// end app-to-db
