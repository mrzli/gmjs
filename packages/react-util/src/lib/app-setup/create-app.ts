import ReactDOM from 'react-dom/client';
import { Action } from 'redux';
import { AnyObject } from '@gmjs/util';
import { AppWrapperConfigAny, createAppWrapper } from './app-wrapper';

export function createReactApp<
  TAppContextData extends AnyObject,
  TAppState extends AnyObject,
  TAppAction extends Action
>(
  app: React.ReactElement,
  wrapperConfigs: readonly AppWrapperConfigAny<
    TAppContextData,
    TAppState,
    TAppAction
  >[]
): React.ReactElement {
  const wrapApp = createAppWrapper(wrapperConfigs);
  return wrapApp(app);
}

export function createReactRoot(): ReactDOM.Root {
  return ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
}
