#!/usr/bin/env node
// Generate the website's JSON data files from canonical assets.
// Emits the same shapes awesome-copilot's website expects: skills + instructions
// populated, and empty stubs for resource types this repo doesn't have yet.
import fs from "fs";
import path from "path";
import { loadSkills, loadInstructions } from "./lib/assets.mjs";
import { ROOT_DIR, INSTRUCTIONS_DIR } from "./lib/constants.mjs";

const DATA_DIR = path.join(ROOT_DIR, "website", "public", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const titleize = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const write = (name, obj) =>
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(obj, null, 2) + "\n");

// ---------- skills ----------
const skills = loadSkills().map((s) => {
  const rel = `skills/${s.slug}`;
  const files = [{ path: `${rel}/SKILL.md`, name: "SKILL.md", size: 0 }];
  for (const asset of s.assets) {
    if (asset.endsWith("/.gitkeep")) continue;
    let size = 0;
    try {
      size = fs.statSync(path.join(s.dir, asset)).size;
    } catch {}
    files.push({ path: `${rel}/${asset}`, name: asset, size });
  }
  const assets = s.assets.filter((a) => !a.endsWith("/.gitkeep"));
  const title = titleize(s.slug);
  return {
    id: s.slug,
    name: s.name,
    title,
    description: s.description,
    assets,
    hasAssets: assets.length > 0,
    assetCount: assets.length,
    path: rel,
    skillFile: `${rel}/SKILL.md`,
    files,
    lastUpdated: null,
    searchText: `${title} ${s.description} ${s.slug}`.toLowerCase(),
  };
});
write("skills.json", { items: skills, filters: { hasAssets: ["Yes", "No"] } });

// ---------- instructions ----------
const allExtensions = new Set();
const allPatterns = new Set();
const instructions = loadInstructions().map((i) => {
  const patterns = i.globs
    ? i.globs.split(",").map((g) => g.trim()).filter(Boolean)
    : [];
  const extensions = [];
  for (const p of patterns) {
    allPatterns.add(p);
    const m = p.match(/\.([a-z0-9]+)$/i);
    if (m) {
      extensions.push(m[1]);
      allExtensions.add(m[1]);
    }
  }
  const title = titleize(i.slug);
  // `applyTo` drives display: show globs for glob-mode, else the activation label.
  const applyTo =
    i.activation === "glob" ? i.globs : `(${i.activation})`;
  return {
    id: i.slug,
    title,
    description: i.description,
    activation: i.activation,
    applyTo,
    applyToPatterns: patterns,
    extensions: [...new Set(extensions)],
    path: `instructions/${i.slug}.instructions.md`,
    filename: `${i.slug}.instructions.md`,
    lastUpdated: null,
  };
});
write("instructions.json", {
  items: instructions,
  filters: {
    patterns: [...allPatterns].sort(),
    extensions: ["(none)", ...[...allExtensions].sort()],
  },
});

// ---------- empty stubs for resource types not in this repo (yet) ----------
write("agents.json", { items: [], filters: { models: [], tools: [] } });
write("hooks.json", { items: [], filters: { hooks: [], tags: [] } });
write("workflows.json", { items: [], filters: { triggers: [] } });
write("plugins.json", { items: [], filters: { tags: [] } });
write("extensions.json", { items: [] });
write("tools.json", { items: [], filters: { categories: [] } });
write("samples.json", {
  totalRecipes: 0,
  totalCookbooks: 0,
  items: [],
  filters: { languages: [], tags: [] },
});

// ---------- search index ----------
const searchIndex = [
  ...skills.map((s) => ({
    type: "skill",
    id: s.id,
    title: s.title,
    description: s.description,
    path: s.path,
    lastUpdated: s.lastUpdated,
    searchText: s.searchText,
  })),
  ...instructions.map((i) => ({
    type: "instruction",
    id: i.id,
    title: i.title,
    description: i.description,
    path: i.path,
    lastUpdated: i.lastUpdated,
    searchText: `${i.title} ${i.description} ${i.applyTo || ""}`.toLowerCase(),
  })),
];
write("search-index.json", searchIndex);

// ---------- manifest ----------
write("manifest.json", {
  generated: null,
  counts: {
    agents: 0,
    instructions: instructions.length,
    skills: skills.length,
    hooks: 0,
    workflows: 0,
    plugins: 0,
    extensions: 0,
    tools: 0,
    contributors: 0,
    samples: 0,
    total: searchIndex.length,
  },
});

console.log(
  `✅ Website data generated: ${skills.length} skills, ${instructions.length} instructions → website/public/data/`
);

// INSTRUCTIONS_DIR is imported to assert the canonical dir is resolvable.
void INSTRUCTIONS_DIR;
