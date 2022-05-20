import { NIL, v4 } from 'uuid';

export function getNilUuid(): string {
  return NIL;
}

export function getRandomUuid(): string {
  return v4();
}
