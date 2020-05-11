export function arr<T>(i: T[] | T): T[] {
  return Array.isArray(i) ? i : [i];
}
