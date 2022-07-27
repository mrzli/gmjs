import { useRef, useEffect } from 'react';
import { Observable, Subject, Unsubscribable } from 'rxjs';

// https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export type SubjectPipeline<TInputValue, TOutputValue> = (
  source$: Observable<TInputValue>
) => Observable<TOutputValue>;
export type MonoTypeSubjectPipeline<TValue> = SubjectPipeline<TValue, TValue>;
export type ObservableSubscribe<TValue> = (value: TValue) => {
  readonly unsubscribe: Unsubscribable;
};

export type SubjectOrUndefined<T> = Subject<T> | undefined;
export type MutableRefSubject<T> = React.MutableRefObject<
  SubjectOrUndefined<T>
>;

export function useSubjectRef<TInputValue, TOutputValue>(
  pipeline: SubjectPipeline<TInputValue, TOutputValue>,
  callback: (value: TOutputValue) => void
): MutableRefSubject<TInputValue> {
  const subjectRef: MutableRefSubject<TInputValue> =
    useRef<SubjectOrUndefined<TInputValue>>(undefined);

  useEffect(() => {
    const subject$ = new Subject<TInputValue>();
    const subscription = pipeline(subject$).subscribe(callback);
    subjectRef.current = subject$;
    return () => {
      subscription.unsubscribe();
      subjectRef.current = undefined;
    };
  }, [pipeline, callback]);

  return subjectRef;
}

export const useMonoTypeSubjectRef: <TValue>(
  pipeline: MonoTypeSubjectPipeline<TValue>,
  callback: (value: TValue) => void
) => MutableRefSubject<TValue> = useSubjectRef;

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
