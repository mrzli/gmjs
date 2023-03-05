import { Fn1 } from "../../types";
import { applyFn, transformPipe } from "../function-pipe";
import { toArray } from "./iterable";

export function getArrayResult<T, U>(
  input: T,
  transformer: Fn1<T, Iterable<U>>
): readonly U[] {
  return applyFn(input, transformPipe(transformer, toArray()));
}