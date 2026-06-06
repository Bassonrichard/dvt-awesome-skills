#!/usr/bin/env node
// Pre-build each skill into every tool's native format under installs/<tool>/<slug>/,
// so a skill can be installed with a plain `git clone` + sparse checkout on any git
// host (no Node, no gh CLI). The website's "git clone" install command points here.
//
// This output is generated and committed. Regenerate with `npm run build` (which
// chains this) or `npm run installs:build` after changing skills or adapters.
import fs from "fs";
import path from "path";
import { loadSkills, targetTools } from "./lib/assets.mjs";
import { getAdapter } from "./adapters/index.mjs";
import { ROOT_DIR, TOOLS } from "./lib/constants.mjs";

const INSTALLS_DIR = path.join(ROOT_DIR, "installs");

function writeEntry(entry, targetRoot) {
  const dest = path.join(targetRoot, entry.path);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (entry.copyFrom) fs.copyFileSync(entry.copyFrom, dest);
  else fs.writeFileSync(dest, entry.contents);
}

function main() {
  fs.rmSync(INSTALLS_DIR, { recursive: true, force: true });

  const skills = loadSkills();
  let files = 0;
  let combos = 0;

  for (const tool of TOOLS) {
    const adapter = getAdapter(tool);
    for (const skill of skills) {
      if (!targetTools(skill.metadata).includes(tool)) continue;
      const skillRoot = path.join(INSTALLS_DIR, tool, skill.slug);
      for (const entry of adapter.transformSkill(skill)) {
        writeEntry(entry, skillRoot);
        files++;
      }
      combos++;
    }
  }

  console.log(
    `✅ Built installs/ — ${files} file(s) across ${combos} skill×tool combo(s).`
  );
}

main();
