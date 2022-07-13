import { AnyObject } from '@gmjs/util';
import { Except } from 'type-fest';

export type WithoutId<T extends AnyObject> = Except<T, 'id'>;

export type DbWithoutId<T extends AnyObject> = Except<T, '_id'>;
