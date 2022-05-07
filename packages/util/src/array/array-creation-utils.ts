export function createArrayOfLength(length: number): readonly undefined[] {
  return new Array<undefined>(length).fill(undefined);
}

export function fillArrayOfLengthWithValue<T>(
  length: number,
  content: T
): readonly T[] {
  return Array.from({ length }, () => content);
}

export function fillArrayOfLengthWithValueMapper<T>(
  length: number,
  valueMapper: (index: number) => T
): readonly T[] {
  return Array.from({ length }, (_, index) => valueMapper(index));
}
