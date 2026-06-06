// Loaders for canonical assets (skills + instructions).
import fs from "fs";
import path from "path";
import { parseFile } from "./frontmatter.mjs";
import { SKILLS_DIR, INSTRUCTIONS_DIR, TOOLS } from "./constants.mjs";

const ASSET_SUBDIRS = ["references", "assets", "scripts"];

function listBundledAssets(skillDir) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(skillDir, full).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        if (dir !== skillDir || ASSET_SUBDIRS.includes(entry.name)) walk(full);
      } else if (rel !== "SKILL.md") {
        out.push(rel);
      }
    }
  };
  if (fs.existsSync(skillDir)) walk(skillDir);
  return out.sort();
}

/** Resolve which tools an asset targets (frontmatter metadata.tools, default: all). */
export function targetTools(metadata) {
  const requested = metadata?.tools;
  if (!Array.isArray(requested) || requested.length === 0) return [...TOOLS];
  return requested.filter((t) => TOOLS.includes(t));
}

/** Load all canonical skills as normalized objects. */
export function loadSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = path.join(SKILLS_DIR, e.name);
      const skillMd = path.join(dir, "SKILL.md");
      if (!fs.existsSync(skillMd)) return null;
      const { data, body } = parseFile(skillMd);
      return {
        kind: "skill",
        slug: e.name,
        name: data.name,
        description: data.description,
        metadata: data.metadata || {},
        body,
        dir,
        assets: listBundledAssets(dir),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Load all canonical instructions as normalized objects. */
export function loadInstructions() {
  if (!fs.existsSync(INSTRUCTIONS_DIR)) return [];
  return fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"))
    .map((f) => {
      const file = path.join(INSTRUCTIONS_DIR, f);
      const { data, body } = parseFile(file);
      return {
        kind: "instruction",
        slug: f.replace(/\.instructions\.md$/, ""),
        description: data.description,
        activation: data.activation,
        globs: data.globs,
        metadata: data.metadata || {},
        body,
        file,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
