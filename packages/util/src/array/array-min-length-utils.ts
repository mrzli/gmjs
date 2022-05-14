import {
  ArrayMinLength1,
  ArrayMinLength2,
  ArrayMinLength3,
  ArrayMinLength4,
  ArrayMinLength5,
} from '../types/generic';

export function mapMinLength1<T, U>(
  array: ArrayMinLength1<T>,
  map: (item: T) => U
): ArrayMinLength1<U> {
  return [map(array[0]), ...array.slice(1).map(map)];
}

export function mapMinLength2<T, U>(
  array: ArrayMinLength2<T>,
  map: (item: T) => U
): ArrayMinLength2<U> {
  return [map(array[0]), map(array[1]), ...array.slice(2).map(map)];
}

export function mapMinLength3<T, U>(
  array: ArrayMinLength3<T>,
  map: (item: T) => U
): ArrayMinLength3<U> {
  return [
    map(array[0]),
    map(array[1]),
    map(array[2]),
    ...array.slice(3).map(map),
  ];
}

export function mapMinLength4<T, U>(
  array: ArrayMinLength4<T>,
  map: (item: T) => U
): ArrayMinLength4<U> {
  return [
    map(array[0]),
    map(array[1]),
    map(array[2]),
    map(array[3]),
    ...array.slice(4).map(map),
  ];
}

export function mapMinLength5<T, U>(
  array: ArrayMinLength5<T>,
  map: (item: T) => U
): ArrayMinLength5<U> {
  return [
    map(array[0]),
    map(array[1]),
    map(array[2]),
    map(array[3]),
    map(array[4]),
    ...array.slice(5).map(map),
  ];
}
