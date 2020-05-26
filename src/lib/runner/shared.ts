export function arr<T>(i: T[] | T): T[] {
  if (!i) {
    return [];
  }

  return Array.isArray(i) ? i : [i];
}
