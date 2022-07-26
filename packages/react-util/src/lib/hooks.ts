import { useRef, useEffect } from 'react';

// https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}