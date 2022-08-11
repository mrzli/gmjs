import { v5 } from 'uuid';

const NAMESPACE = '53cee460-ec52-4589-bfae-b274c5abdfe1';

export function stringToNonRandomInteger(
  input: string,
  min: number,
  max: number
): number {
  const valueStr = v5(input, NAMESPACE);
  const hexString = valueStr.split('-').join('');
  const truncatedHexString = hexString.substring(0, 10);
  const valueNum = Number.parseInt(truncatedHexString, 16);
  const inclusiveRange = max - min + 1;
  return (valueNum % inclusiveRange) + min;
}
