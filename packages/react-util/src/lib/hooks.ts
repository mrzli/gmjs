import { useRef, useEffect, useMemo } from 'react';
import { Observable, OperatorFunction, Subject } from 'rxjs';

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

export function useSubject<TInputValue, TOutputValue>(
  pipeline: OperatorFunction<TInputValue, TOutputValue>,
  callback: (value: TOutputValue) => void
): Subject<TInputValue> {
  const subject$ = useMemo<Subject<TInputValue>>(() => {
    return new Subject<TInputValue>();
  }, []);

  useEffect(() => {
    const obs$ = subject$.pipe(pipeline);
    const subscription = obs$.subscribe(callback);
    return () => {
      subscription.unsubscribe();
    };
  }, [subject$, pipeline, callback]);

  return subject$;
}
