// Frontmatter parsing + canonical content serialization.
// Parser ported from awesome-copilot's eng/yaml-parser.mjs (vfile-matter based).
import fs from "fs";
import yaml from "js-yaml";
import { VFile } from "vfile";
import { matter } from "vfile-matter";

/**
 * Parse YAML frontmatter and body from a markdown file.
 * @param {string} filePath
 * @returns {{ data: object, body: string }}
 */
export function parseFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const file = new VFile({ path: filePath, value: content });
  matter(file, { strip: true });
  const data = file.data.matter || {};

  // Normalize trailing whitespace on common string fields.
  for (const key of ["name", "description", "activation", "globs"]) {
    if (typeof data[key] === "string") {
      data[key] = data[key].replace(/[\s\r\n]+$/g, "").trim();
    }
  }

  return { data, body: String(file).replace(/^\s*\n/, "") };
}

/**
 * Serialize a frontmatter object + body back into a markdown string.
 * Used by adapters to emit native files.
 * @param {object} data
 * @param {string} body
 * @returns {string}
 */
export function serialize(data, body) {
  const yamlBlock = yaml
    .dump(data, { lineWidth: -1, quotingType: '"', forceQuotes: false })
    .trimEnd();
  return `---\n${yamlBlock}\n---\n\n${body.trimStart()}`;
}
