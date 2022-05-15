import { Nullish } from '@gmjs/util';
import { InternalServerErrorException } from '@nestjs/common';

export function valueOrThrow<T>(value: Nullish<T>, errorMessage?: string): T {
  if (!value) {
    throw new InternalServerErrorException(errorMessage);
  }
  return value;
}
