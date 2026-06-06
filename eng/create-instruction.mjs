#!/usr/bin/env node
// Scaffold a new canonical instruction. Usage: npm run instruction:create -- --name ts-standards [--activation glob] [--globs "**/*.ts"]
import fs from "fs";
import path from "path";
import readline from "readline";
import {
  INSTRUCTIONS_DIR,
  NAME_PATTERN,
  ACTIVATION_MODES,
  DESCRIPTION_MIN_LENGTH,
} from "./lib/constants.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--name" || a === "-n") out.name = args[++i];
    else if (a.startsWith("--name=")) out.name = a.split("=")[1];
    else if (a === "--description" || a === "-d") out.description = args[++i];
    else if (a.startsWith("--description=")) out.description = a.split("=")[1];
    else if (a === "--activation" || a === "-a") out.activation = args[++i];
    else if (a.startsWith("--activation=")) out.activation = a.split("=")[1];
    else if (a === "--globs" || a === "-g") out.globs = args[++i];
    else if (a.startsWith("--globs=")) out.globs = a.split("=")[1];
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
    const name = parsed.name || (await ask(rl, "Instruction name (lowercase-hyphen): ")).trim();
    if (!NAME_PATTERN.test(name)) {
      console.error("❌ Name must be lowercase letters, numbers, and hyphens only.");
      process.exit(1);
    }
    const file = path.join(INSTRUCTIONS_DIR, `${name}.instructions.md`);
    if (fs.existsSync(file)) {
      console.error(`❌ Instruction '${name}' already exists at ${file}`);
      process.exit(1);
    }
    const description =
      parsed.description || (await ask(rl, "Description: ")).trim();
    if (!description || description.length < DESCRIPTION_MIN_LENGTH) {
      console.error(`❌ Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`);
      process.exit(1);
    }
    const activation =
      parsed.activation ||
      (await ask(rl, `Activation (${ACTIVATION_MODES.join(" | ")}) [glob]: `)).trim() ||
      "glob";
    if (!ACTIVATION_MODES.includes(activation)) {
      console.error(`❌ Activation must be one of: ${ACTIVATION_MODES.join(", ")}`);
      process.exit(1);
    }
    let globs = parsed.globs;
    if (activation === "glob" && !globs) {
      globs = (await ask(rl, "Globs (comma-separated, e.g. **/*.ts): ")).trim();
      if (!globs) {
        console.error("❌ globs is required when activation is 'glob'.");
        process.exit(1);
      }
    }

    fs.mkdirSync(INSTRUCTIONS_DIR, { recursive: true });
    const frontmatter = [
      "---",
      `description: '${description.replace(/'/g, "''")}'`,
      `activation: ${activation}`,
      ...(globs ? [`globs: '${globs}'`] : []),
      "metadata:",
      "  tools: [copilot, cursor, windsurf, claude, kiro]",
      "  category: general",
      "---",
    ].join("\n");
    const content = `${frontmatter}

# ${titleize(name)}

State the standard concisely. Use imperative bullet points the model can follow.

- [Rule one]
- [Rule two]
`;
    fs.writeFileSync(file, content);
    console.log(`✅ Created instructions/${name}.instructions.md`);
    console.log("Next: edit the file, then run `npm run validate` and `npm run build`.");
  } finally {
    rl.close();
  }
}

main();
