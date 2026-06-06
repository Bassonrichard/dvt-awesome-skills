#!/usr/bin/env node
// Scaffold a new canonical skill folder. Usage: npm run skill:create -- --name my-skill [--description "..."]
import fs from "fs";
import path from "path";
import readline from "readline";
import { SKILLS_DIR, NAME_PATTERN, DESCRIPTION_MIN_LENGTH } from "./lib/constants.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--name" || a === "-n") out.name = args[++i];
    else if (a.startsWith("--name=")) out.name = a.split("=")[1];
    else if (a === "--description" || a === "-d") out.description = args[++i];
    else if (a.startsWith("--description=")) out.description = a.split("=")[1];
    else if (!a.startsWith("-") && !out.name) out.name = a;
  }
  return out;
}

function ask(rl, q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

function titleize(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const parsed = parseArgs();
    const name = parsed.name || (await ask(rl, "Skill name (lowercase-hyphen): ")).trim();

    if (!NAME_PATTERN.test(name)) {
      console.error("❌ Name must be lowercase letters, numbers, and hyphens only.");
      process.exit(1);
    }
    const folder = path.join(SKILLS_DIR, name);
    if (fs.existsSync(folder)) {
      console.error(`❌ Skill '${name}' already exists at ${folder}`);
      process.exit(1);
    }
    const description =
      parsed.description ||
      (await ask(rl, "Description (what it does + when to use it): ")).trim();
    if (!description || description.length < DESCRIPTION_MIN_LENGTH) {
      console.error(`❌ Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`);
      process.exit(1);
    }

    fs.mkdirSync(path.join(folder, "references"), { recursive: true });
    const content = `---
name: ${name}
description: '${description.replace(/'/g, "''")}'
metadata:
  tools: [copilot, cursor, windsurf, claude, kiro]
  category: general
---

# ${titleize(name)}

Brief overview of what this skill does.

## When to use this skill

Use this skill when you need to:
- [Primary use case]
- [Secondary use case]

## Steps

1. [Step one]
2. [Step two]

## References

Heavy detail lives in \`references/\` — load on demand:

| Reference | When to load |
|---|---|
| references/example.md | [describe] |
`;
    fs.writeFileSync(path.join(folder, "SKILL.md"), content);
    fs.writeFileSync(
      path.join(folder, "references", ".gitkeep"),
      "# Put progressive-disclosure docs here, or delete this folder if unused.\n"
    );

    console.log(`✅ Created skills/${name}/SKILL.md`);
    console.log("Next: edit SKILL.md, then run `npm run validate` and `npm run build`.");
  } finally {
    rl.close();
  }
}

main();
