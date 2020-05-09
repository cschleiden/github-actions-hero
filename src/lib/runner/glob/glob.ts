import { isMatch } from "micromatch";

export function match(glob: string, input: string): boolean {
  // replace any quotes required to mask `*` in yaml
  glob = glob.replace(/'/g, "");

  return isMatch(input, glob, {
    bash: false,
    dot: false,
    noextglob: true,
  });
}

export function filterPaths(globs: string[], input: string): boolean {
  return globs.every((g) => match(g, input));
}

export function filterBranches(globs: string[], input: string): boolean {
  return globs.every((g) => match(g, input));
}
