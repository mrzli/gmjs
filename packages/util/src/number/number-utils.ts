const FLOAT_REGEX = /^-?\d+(?:\.\d+)?$/;

export function parseFloatOrThrow(input: string): number {
  if (!FLOAT_REGEX.test(input)) {
    throw new Error(`Value is not a valid number: '${input}'`);
  }

  const result = Number.parseFloat(input);
  if (Number.isNaN(result)) {
    throw new Error(`Value is not a valid number: '${input}'`);
  }

  return result;
}

const INTEGER_REGEX = /^-?\d+$/;

export function parseIntegerOrThrow(input: string): number {
  if (!INTEGER_REGEX.test(input)) {
    throw new Error(`Value is not integer: '${input}'`);
  }

  return Number.parseInt(input, 10);
}

export function padNonNegativeIntWithZeroes(
  value: number,
  maxLength: number
): string {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("'value' must be an integer greater or equal to zero");
  }

  if (!Number.isInteger(maxLength) || maxLength <= 0) {
    throw new Error("'maxLength' must be an positive greater than zero");
  }

  return value.toString().padStart(maxLength, '0');
}

export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
