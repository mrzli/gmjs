export function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
}

export function trimStart(value: string, chars: string): string {
  return value.replace(new RegExp(`^[${chars}]+`), '');
}

export function trimEnd(value: string, chars: string): string {
  return value.replace(new RegExp(`[${chars}]+$`), '');
}

export function trim(value: string, chars: string): string {
  const startTrimmed = trimStart(value, chars);
  return trimEnd(startTrimmed, chars);
}

export function isCharUppercase(value: string): boolean {
  return (
    value.length === 1 &&
    value === value.toLocaleUpperCase() &&
    value !== value.toLocaleLowerCase()
  );
}

export function isCharLowercase(value: string): boolean {
  return (
    value.length === 1 &&
    value === value.toLocaleLowerCase() &&
    value !== value.toLocaleUpperCase()
  );
}
