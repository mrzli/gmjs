import {
  Action,
  applyMiddleware,
  CombinedState,
  combineReducers,
  legacy_createStore as createStore,
  PreloadedState,
  ReducersMapObject,
  Store,
} from 'redux';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { AnyObject } from '@gmjs/util';

export function createAppStore<
  TAppState extends AnyObject,
  TAppAction extends Action,
  TAppDependencies extends AnyObject
>(
  reducers: ReducersMapObject<TAppState, TAppAction>,
  initialState: TAppState,
  appEpic: Epic<
    TAppAction,
    TAppAction,
    TAppState,
    TAppDependencies
  >,
  dependencies: TAppDependencies,
): Store<TAppState, TAppAction> {
  const appReducer = combineReducers(reducers);

  const reduxObservableMiddleware = createEpicMiddleware<
    TAppAction,
    TAppAction,
    TAppState,
    TAppDependencies
  >({ dependencies });

  const composeEnhancers = composeWithDevToolsDevelopmentOnly({});
  const storeEnhancer = applyMiddleware(reduxObservableMiddleware);
  const enhancer = composeEnhancers(storeEnhancer);

  const store = createStore(
    appReducer,
    initialState as PreloadedState<CombinedState<TAppState>>,
    enhancer
  );

  reduxObservableMiddleware.run(appEpic);

  return store;
}
