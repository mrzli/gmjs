import { Except } from 'type-fest';

export interface ObjectWithId {
  readonly id: string;
}

export type WithoutId<T extends ObjectWithId> = Except<T, 'id'>;
