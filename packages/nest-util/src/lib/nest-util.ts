import { Nullish } from '@gmjs/util';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function valueOrThrow<T>(value: Nullish<T>, errorMessage?: string): T {
  if (!value) {
    throw new InternalServerErrorException(
      errorMessage ?? 'Internal server error'
    );
  }
  return value;
}

export function valueOrThrowItemNotFoundException<T>(
  result: T | undefined,
  id: string,
  errorMessage?: string
): T {
  if (!result) {
    throw new NotFoundException(
      errorMessage ?? `Item with id '${id}' not found.`
    );
  }
  return result;
}
