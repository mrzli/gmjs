import { useRef, useEffect, useMemo } from 'react';
import { Observable, Observer, OperatorFunction, Subject } from 'rxjs';

// https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useObservable<TValue>(
  observable$: Observable<TValue>,
  callback: (value: TValue) => void
): void {
  useEffect(() => {
    const subscription = observable$.subscribe(callback);
    return () => {
      subscription.unsubscribe();
    };
  }, [observable$, callback]);
}

export type ObserverNextFn<T> = (value: T) => void;

export function useSubject<TInputValue, TOutputValue>(
  pipeline: OperatorFunction<TInputValue, TOutputValue>,
  observer?: Partial<Observer<TOutputValue>> | ObserverNextFn<TOutputValue>
): Subject<TInputValue> {
  const subject$ = useMemo<Subject<TInputValue>>(() => {
    return new Subject<TInputValue>();
  }, []);

  useEffect(() => {
    const obs$ = subject$.pipe(pipeline);
    const subscription =
      observer instanceof Function
        ? obs$.subscribe(observer)
        : obs$.subscribe(observer);
    return () => {
      subscription.unsubscribe();
    };
  }, [subject$, pipeline, observer]);

  return subject$;
}
