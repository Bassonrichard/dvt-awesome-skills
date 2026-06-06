#!/usr/bin/env node
// Install canonical assets into a target repo in a tool's native format.
// Usage:
//   npm run install:tool -- --tool cursor --dir /path/to/repo
//   npm run install:tool -- --tool claude --dir . --skill dvt-secure-api-review
//   npm run install:tool -- --tool kiro --dir . --instruction ts-standards --dry-run
import fs from "fs";
import path from "path";
import { loadSkills, loadInstructions, targetTools } from "./lib/assets.mjs";
import { getAdapter } from "./adapters/index.mjs";
import { TOOLS } from "./lib/constants.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { skills: [], instructions: [], dir: ".", dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--tool" || a === "-t") out.tool = args[++i];
    else if (a === "--dir" || a === "-d") out.dir = args[++i];
    else if (a === "--skill") out.skills.push(args[++i]);
    else if (a === "--instruction") out.instructions.push(args[++i]);
    else if (a === "--dry-run") out.dryRun = true;
  }
  return out;
}

function writeEntry(entry, targetRoot, dryRun) {
  const dest = path.join(targetRoot, entry.path);
  if (dryRun) {
    console.log(`  would write ${entry.path}`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (entry.copyFrom) fs.copyFileSync(entry.copyFrom, dest);
  else fs.writeFileSync(dest, entry.contents);
  console.log(`  ✓ ${entry.path}`);
}

function main() {
  const { tool, dir, skills, instructions, dryRun } = parseArgs();
  if (!tool || !TOOLS.includes(tool)) {
    console.error(`❌ --tool must be one of: ${TOOLS.join(", ")}`);
    process.exit(1);
  }
  const adapter = getAdapter(tool);
  const targetRoot = path.resolve(dir);

  const selectedSkills = loadSkills().filter(
    (s) =>
      (skills.length === 0 || skills.includes(s.slug)) &&
      targetTools(s.metadata).includes(tool)
  );
  const selectedInstructions = loadInstructions().filter(
    (i) =>
      (instructions.length === 0 || instructions.includes(i.slug)) &&
      targetTools(i.metadata).includes(tool)
  );

  console.log(
    `Installing for ${tool} → ${targetRoot}${dryRun ? " (dry run)" : ""}`
  );
  let count = 0;
  for (const skill of selectedSkills)
    for (const entry of adapter.transformSkill(skill)) {
      writeEntry(entry, targetRoot, dryRun);
      count++;
    }
  for (const ins of selectedInstructions)
    for (const entry of adapter.transformInstruction(ins)) {
      writeEntry(entry, targetRoot, dryRun);
      count++;
    }
  console.log(
    `\n✅ ${dryRun ? "Planned" : "Wrote"} ${count} file(s) for ${tool} ` +
      `(${selectedSkills.length} skill(s), ${selectedInstructions.length} instruction(s)).`
  );
}

main();
