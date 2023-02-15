// TODO GM: remove this if util starts being recognized again
//  don't know what causes this issue, it makes no sense,
//  and previously when I had it on another project, it stopped occurring
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { inspect } from 'util';

export function logErrorWithFullValue(e: unknown): void {
  console.error(inspectValue(e));
}

export function logErrorWithFullValueAndRethrow(e: unknown): void {
  logErrorWithFullValue(e);
  throw e;
}

export function logWithFullValue(value: unknown): void {
  logWithDepth(value);
}

export function logWithDepth(value: unknown, depth?: number): void {
  console.log(inspectValue(value, depth));
}

function inspectValue(value: unknown, depth?: number): string {
  return inspect(value, {
    showHidden: false,
    depth: depth ?? Number.POSITIVE_INFINITY,
    colors: true,
  });
}
