import { Fn1 } from '../../types/function';
import { NotIterable } from '../../types/generic';

export function tap<T>(
  action: (input: NotIterable<T>) => void
): Fn1<NotIterable<T>, NotIterable<T>> {
  return (input: NotIterable<T>): NotIterable<T> => {
    action(input);
    return input;
  };
}

export function conditionalConvert<T>(
  condition: ((input: T) => boolean) | boolean,
  convertFn: (input: T) => T
): Fn1<T, T> {
  return (input: T): T => {
    const conditionValue =
      condition instanceof Function ? condition(input) : condition;
    if (conditionValue) {
      return convertFn(input);
    } else {
      return input;
    }
  };
}
