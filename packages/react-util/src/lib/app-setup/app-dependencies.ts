import {
  CookieWrapper,
  createCookieWrapper,
  createLocalStorageWrapper,
  createSessionStorageWrapper,
  StorageWrapper,
} from '@gmjs/browser-util';
import { AnyObject } from '@gmjs/util';

export interface AppDependenciesBase<
  TAppApi extends AnyObject,
  TSessionStorageKey extends string,
  TLocalStorageKey extends string,
  TCookieKey extends string
> {
  readonly api: TAppApi;
  readonly sessionStorage: StorageWrapper<TSessionStorageKey>;
  readonly localStorage: StorageWrapper<TLocalStorageKey>;
  readonly cookie: CookieWrapper<TCookieKey>;
}

export function createAppDependenciesBase<
  TAppApi extends AnyObject,
  TSessionStorageKey extends string,
  TLocalStorageKey extends string,
  TCookieKey extends string
>(
  appApi: TAppApi
): AppDependenciesBase<
  TAppApi,
  TSessionStorageKey,
  TLocalStorageKey,
  TCookieKey
> {
  return {
    api: appApi,
    sessionStorage: createSessionStorageWrapper<TSessionStorageKey>(),
    localStorage: createLocalStorageWrapper<TLocalStorageKey>(),
    cookie: createCookieWrapper<TCookieKey>(),
  };
}
