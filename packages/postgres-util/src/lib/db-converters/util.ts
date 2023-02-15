export const NULL = 'NULL';

export function quoteValue(value: string): string {
  return `'${value.split("'").join("''")}'`;
}
