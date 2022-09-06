import { identityFn } from '../function/generic-function-utils';
import { Fn1 } from '../types/function';
import { AnyValue } from '../types/generic';

export function transformPipe<A>(): Fn1<A, A>;
export function transformPipe<A, B>(fn1: Fn1<A, B>): Fn1<A, B>;
export function transformPipe<A, B, C>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>
): Fn1<A, C>;
export function transformPipe<A, B, C, D>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>
): Fn1<A, D>;
export function transformPipe<A, B, C, D, E>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>,
  fn4: Fn1<D, E>
): Fn1<A, E>;
export function transformPipe<A, B, C, D, E, F>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>,
  fn4: Fn1<D, E>,
  fn5: Fn1<E, F>
): Fn1<A, F>;
export function transformPipe<A, B, C, D, E, F, G>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>,
  fn4: Fn1<D, E>,
  fn5: Fn1<E, F>,
  fn6: Fn1<F, G>
): Fn1<A, F>;
export function transformPipe<A, B, C, D, E, F, G, H>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>,
  fn4: Fn1<D, E>,
  fn5: Fn1<E, F>,
  fn6: Fn1<F, G>,
  fn7: Fn1<G, H>
): Fn1<A, H>;
export function transformPipe<A, B, C, D, E, F, G, H, I>(
  fn1: Fn1<A, B>,
  fn2: Fn1<B, C>,
  fn3: Fn1<C, D>,
  fn4: Fn1<D, E>,
  fn5: Fn1<E, F>,
  fn6: Fn1<F, G>,
  fn7: Fn1<G, H>,
  fn8: Fn1<H, I>
): Fn1<A, I>;
export function transformPipe<TInput, TOutput>(
  ...ops: readonly Fn1<AnyValue, AnyValue>[]
): Fn1<TInput, TOutput> {
  return ops.reduce(composeFunction, identityFn);
}

export function transformPipeMono<T>(...ops: readonly Fn1<T, T>[]): Fn1<T, T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return transformPipe(...ops);
}

function composeFunction<A, B, C>(f1: Fn1<A, B>, f2: Fn1<B, C>): Fn1<A, C> {
  return (s: A) => f2(f1(s));
}

export function applyFn<TInput, TOutput>(value: TInput, fn: Fn1<TInput, TOutput>): TOutput {
  return fn(value);
}
