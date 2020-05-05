export function contains<S extends T[] | string, T>(
  haystack: S,
  needle: T
): boolean {
  if (Array.isArray(haystack)) {
    return haystack.indexOf(needle) !== -1;
  } else if (typeof haystack === "string") {
    return (
      ("" + haystack)
        .toLocaleLowerCase()
        .indexOf((needle as any).toLocaleLowerCase()) !== -1
    );
  }
}

export function startsWith(haystack: string, needle: string): boolean {
  return haystack.startsWith(needle);
}

export function endsWith(haystack: string, needle: string): boolean {
  return haystack.endsWith(needle);
}

export function join<T>(arr: T[], separator?: string): string {
  return arr.join(separator);
}
