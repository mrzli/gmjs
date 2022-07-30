import { transformIfExists } from '@gmjs/util';
import { Decimal128, Double, Long, ObjectId } from 'mongodb';

export function mongoIdDbToApp(value: ObjectId): string {
  return value.toString();
}

export function mongoIdOptionalDbToApp(
  value: ObjectId | undefined
): string | undefined {
  return transformIfExists(value, mongoIdDbToApp, undefined);
}

export function mongoLongDbToApp(value: Long): number {
  return value.toInt();
}

export function mongoLongOptionalDbToApp(
  value: Long | undefined
): number | undefined {
  return transformIfExists(value, mongoLongDbToApp, undefined);
}

export function mongoDoubleDbToApp(value: Double): number {
  return value.valueOf();
}

export function mongoDoubleOptionalDbToApp(
  value: Double | undefined
): number | undefined {
  return transformIfExists(value, mongoDoubleDbToApp, undefined);
}

export function mongoDecimalDbToApp(value: Decimal128): string {
  return value.toString();
}

export function mongoDecimalOptionalDbToApp(
  value: Decimal128 | undefined
): string | undefined {
  return transformIfExists(value, mongoDecimalDbToApp, undefined);
}

export function mongoDateDbToApp(value: Date): string {
  return value.toISOString();
}

export function mongoDateOptionalDbToApp(
  value: Date | undefined
): string | undefined {
  return transformIfExists(value, mongoDateDbToApp, undefined);
}

export function mongoIdAppToDb(value: string): ObjectId {
  return new ObjectId(value);
}

export function mongoIdOptionalAppToDb(
  value: string | undefined
): ObjectId | undefined {
  return transformIfExists(value, mongoIdAppToDb, undefined);
}

export function mongoLongAppToDb(value: number): Long {
  return new Long(value);
}

export function mongoLongOptionalAppToDb(
  value: number | undefined
): Long | undefined {
  return transformIfExists(value, mongoLongAppToDb, undefined);
}

export function mongoDoubleAppToDb(value: number): Double {
  return new Double(value);
}

export function mongoDoubleOptionalAppToDb(
  value: number | undefined
): Double | undefined {
  return transformIfExists(value, mongoDoubleAppToDb, undefined);
}

export function mongoDecimalAppToDb(value: string): Decimal128 {
  return new Decimal128(value);
}

export function mongoDecimalOptionalAppToDb(
  value: string | undefined
): Decimal128 | undefined {
  return transformIfExists(value, mongoDecimalAppToDb, undefined);
}

export function mongoDateAppToDb(value: string): Date {
  return new Date(value);
}

export function mongoDateOptionalAppToDb(
  value: string | undefined
): Date | undefined {
  return transformIfExists(value, mongoDateAppToDb, undefined);
}
