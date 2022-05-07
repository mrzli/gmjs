export function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
}
