// TODO GM: remove this if util starts being recognized again
//  don't know what causes this issue, it makes no sense,
//  and previously when I had it on another project, it stopped occurring
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { inspect } from 'util';

export function logErrorWithFullObject(e: unknown): void {
  console.error(
    inspect(e, {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );
}

export function logErrorWithFullObjectAndRethrow(e: unknown): void {
  logErrorWithFullObject(e);
  throw e;
}
