import { Action } from 'redux';
import { AnyValue } from '@gmjs/util';

export interface AppActionBase<TType extends string, TPayload>
  extends Action<TType> {
  readonly type: TType;
  readonly payload: TPayload;
}

export type TypeToAppAction<
  TAllActionType extends AppActionBase<string, AnyValue>,
  TType extends string
> = Extract<TAllActionType, { type: TType }>;
