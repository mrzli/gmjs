import { Action, Reducer } from 'redux';
import produce, { Draft } from 'immer';

export function createReducer<TState, TAction extends Action>(
  initialState: TState,
  createReducerCases: (action: TAction) => (state: Draft<TState>) => void
): Reducer<TState, TAction> {
  return function (state: TState = initialState, action: TAction): TState {
    return produce(state, createReducerCases(action));
  };
}
