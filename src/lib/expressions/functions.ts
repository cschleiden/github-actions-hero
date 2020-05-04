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
