#!/usr/bin/env node
// Validate all canonical skills + instructions. CI gate.
import fs from "fs";
import path from "path";
import { loadSkills, loadInstructions } from "./lib/assets.mjs";
import {
  NAME_PATTERN,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  MAX_ASSET_BYTES,
  ACTIVATION_MODES,
  TOOLS,
} from "./lib/constants.mjs";

let errorCount = 0;
const fail = (where, msg) => {
  errorCount++;
  console.error(`❌ ${where}: ${msg}`);
};

function validateName(where, name, mustMatchSlug) {
  if (!name || typeof name !== "string") return fail(where, "name is required");
  if (!NAME_PATTERN.test(name)) fail(where, "name must be lowercase letters/numbers/hyphens");
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH)
    fail(where, `name must be ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} chars`);
  if (mustMatchSlug && name !== mustMatchSlug)
    fail(where, `name '${name}' must match folder '${mustMatchSlug}'`);
}

function validateDescription(where, description) {
  if (!description || typeof description !== "string")
    return fail(where, "description is required");
  if (description.length < DESCRIPTION_MIN_LENGTH)
    fail(where, `description must be ≥ ${DESCRIPTION_MIN_LENGTH} chars`);
  if (description.length > DESCRIPTION_MAX_LENGTH)
    fail(where, `description must be ≤ ${DESCRIPTION_MAX_LENGTH} chars`);
}

function validateTools(where, metadata) {
  const tools = metadata?.tools;
  if (tools === undefined) return;
  if (!Array.isArray(tools)) return fail(where, "metadata.tools must be an array");
  for (const t of tools)
    if (!TOOLS.includes(t)) fail(where, `unknown tool '${t}' (allowed: ${TOOLS.join(", ")})`);
}

console.log("🔎 Validating skills…");
for (const skill of loadSkills()) {
  const where = `skills/${skill.slug}`;
  validateName(where, skill.name, skill.slug);
  validateDescription(where, skill.description);
  validateTools(where, skill.metadata);
  for (const asset of skill.assets) {
    const bytes = fs.statSync(path.join(skill.dir, asset)).size;
    if (bytes > MAX_ASSET_BYTES)
      fail(where, `asset '${asset}' is ${(bytes / 1e6).toFixed(1)}MB (max 5MB)`);
  }
}

console.log("🔎 Validating instructions…");
for (const ins of loadInstructions()) {
  const where = `instructions/${ins.slug}.instructions.md`;
  if (!NAME_PATTERN.test(ins.slug)) fail(where, "file name must be lowercase-hyphen");
  validateDescription(where, ins.description);
  validateTools(where, ins.metadata);
  if (!ACTIVATION_MODES.includes(ins.activation))
    fail(where, `activation must be one of: ${ACTIVATION_MODES.join(", ")}`);
  if (ins.activation === "glob" && !ins.globs)
    fail(where, "globs is required when activation is 'glob'");
}

const skillCount = loadSkills().length;
const insCount = loadInstructions().length;
if (errorCount > 0) {
  console.error(`\n💥 Validation failed with ${errorCount} error(s).`);
  process.exit(1);
}
console.log(`\n✅ Valid: ${skillCount} skill(s), ${insCount} instruction(s).`);
