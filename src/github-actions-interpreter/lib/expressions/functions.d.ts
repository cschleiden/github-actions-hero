export declare function contains<S extends T[] | string, T>(haystack: S, needle: T): boolean;
export declare function startsWith(haystack: string, needle: string): boolean;
export declare function endsWith(haystack: string, needle: string): boolean;
export declare function join<T>(arr: T[], separator?: string): string;
export declare function toJson(input: unknown): string;
