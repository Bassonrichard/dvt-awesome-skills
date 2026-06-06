// Shared helpers for adapters.
import { serialize } from "../lib/frontmatter.mjs";

/** Split a canonical comma/space separated glob string into an array. */
export function globList(globs) {
  if (!globs) return [];
  return String(globs)
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

/** Bundled-asset copy entries for a skill, rebased under `targetDir`. */
export function skillAssetCopies(skill, targetDir) {
  return skill.assets
    .filter((rel) => !rel.endsWith("/.gitkeep"))
    .map((rel) => ({
      path: `${targetDir}/${rel}`,
      copyFrom: `${skill.dir}/${rel}`,
    }));
}

/** Build a markdown file (frontmatter + body) entry. */
export function mdFile(path, frontmatter, body) {
  return { path, contents: serialize(frontmatter, body) };
}

/** A plain-text/markdown file with no frontmatter. */
export function rawFile(path, contents) {
  return { path, contents };
}
