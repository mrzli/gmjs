import { useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Observable, Observer, OperatorFunction, Subject } from 'rxjs';
import { z } from 'zod';

export function useValidatedQueryParams<T extends z.ZodTypeAny>(
  schema: T
): z.infer<typeof schema> {
  const [searchParams] = useSearchParams();

  // TODO GM: implement proper exception handling
  return useMemo(() => {
    return schema.parse(searchParamsToObject(searchParams));
  }, [schema, searchParams]);
}

function searchParamsToObject(
  searchParams: URLSearchParams
): Record<string, string> {
  const obj: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

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
