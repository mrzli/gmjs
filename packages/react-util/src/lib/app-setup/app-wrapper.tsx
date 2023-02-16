import React, { StrictMode } from 'react';
import { Action, Store } from 'redux';
import { AnyObject, invariant, transformPipeMono } from '@gmjs/util';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  MemoryRouter,
  MemoryRouterProps,
} from 'react-router-dom';
import { Theme, ThemeProvider } from '@mui/material/styles';

export type AppWrapperFn = (content: React.ReactElement) => React.ReactElement;

export function createAppWrapper<
  TAppContextData extends AnyObject,
  TAppState extends AnyObject,
  TAppAction extends Action
>(
  wrapperConfigs: readonly AppWrapperConfigAny<
    TAppContextData,
    TAppState,
    TAppAction
  >[]
): AppWrapperFn {
  const wrapperFunctions: readonly AppWrapperFn[] = wrapperConfigs.map((wc) =>
    configToWrapper(wc)
  );
  return transformPipeMono(...wrapperFunctions);
}

function configToWrapper<
  TAppContextData extends AnyObject,
  TAppState extends AnyObject,
  TAppAction extends Action
>(
  wrapperConfig: AppWrapperConfigAny<TAppContextData, TAppState, TAppAction>
): AppWrapperFn {
  const kind = wrapperConfig.kind;
  switch (kind) {
    case 'strict':
      return wrapWithStrict();
    case 'app-context':
      return wrapWithAppContext<TAppContextData>(wrapperConfig.params);
    case 'browser-router':
      return wrapWithBrowserRouter();
    case 'memory-router':
      return wrapWithMemoryRouter(wrapperConfig.params);
    case 'mui-theme':
      return wrapWithMuiTheme(wrapperConfig.params);
    case 'store':
      return wrapWithStore<TAppState, TAppAction>(wrapperConfig.params);
    default:
      invariant(false, `Invalid wrapper config kind: '${kind}'`);
  }
}

function wrapWithStrict(): AppWrapperFn {
  return (content) => <StrictMode>{content}</StrictMode>;
}

function wrapWithAppContext<TAppContextData extends AnyObject>(
  params: AppContextParams<TAppContextData>
): AppWrapperFn {
  const AppContext = params.AppContext;
  return (content) => (
    <AppContext.Provider value={params.appContext}>
      {content}
    </AppContext.Provider>
  );
}

function wrapWithBrowserRouter(): AppWrapperFn {
  return (content) => <BrowserRouter>{content}</BrowserRouter>;
}

function wrapWithMemoryRouter(params: MemoryRouterParams): AppWrapperFn {
  return (content) => <MemoryRouter {...params}>{content}</MemoryRouter>;
}

function wrapWithStore<TAppState extends AnyObject, TAppAction extends Action>(
  params: StoreParams<TAppState, TAppAction>
): AppWrapperFn {
  return (content) => <Provider store={params.store}>{content}</Provider>;
}

function wrapWithMuiTheme(params: MuiThemeParams): AppWrapperFn {
  return (content) => (
    <ThemeProvider theme={params.theme}>{content}</ThemeProvider>
  );
}

export type AppWrapperConfigKind =
  | 'strict'
  | 'app-context'
  | 'browser-router'
  | 'memory-router'
  | 'mui-theme'
  | 'store';

export interface AppWrapperConfigBase {
  readonly kind: AppWrapperConfigKind;
}

export interface AppWrapperConfigStrict extends AppWrapperConfigBase {
  readonly kind: 'strict';
}

export interface AppWrapperConfigAppContext<TAppContextData extends AnyObject>
  extends AppWrapperConfigBase {
  readonly kind: 'app-context';
  readonly params: AppContextParams<TAppContextData>;
}

export interface AppContextParams<TAppContextData extends AnyObject> {
  readonly AppContext: React.Context<TAppContextData>;
  readonly appContext: TAppContextData;
}

export interface AppWrapperConfigBrowserRouter extends AppWrapperConfigBase {
  readonly kind: 'browser-router';
}

export interface AppWrapperConfigMemoryRouter extends AppWrapperConfigBase {
  readonly kind: 'memory-router';
  readonly params: MemoryRouterParams;
}

export type MemoryRouterParams = Readonly<
  NonNullable<Pick<MemoryRouterProps, 'initialEntries' | 'initialIndex'>>
>;

export interface AppWrapperConfigMuiTheme extends AppWrapperConfigBase {
  readonly kind: 'mui-theme';
  readonly params: MuiThemeParams;
}

export interface MuiThemeParams {
  readonly theme: Theme;
}

export interface AppWrapperConfigStore<
  TAppState extends AnyObject,
  TAppAction extends Action
> extends AppWrapperConfigBase {
  readonly kind: 'store';
  readonly params: StoreParams<TAppState, TAppAction>;
}

export interface StoreParams<
  TAppState extends AnyObject,
  TAppAction extends Action
> {
  readonly store: Store<TAppState, TAppAction>;
}

export type AppWrapperConfigAny<
  TAppContextData extends AnyObject,
  TAppState extends AnyObject,
  TAppAction extends Action
> =
  | AppWrapperConfigStrict
  | AppWrapperConfigAppContext<TAppContextData>
  | AppWrapperConfigBrowserRouter
  | AppWrapperConfigMemoryRouter
  | AppWrapperConfigMuiTheme
  | AppWrapperConfigStore<TAppState, TAppAction>;
