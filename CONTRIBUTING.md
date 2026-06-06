# Contributing to DVT Awesome Skills

Thanks for adding to DVT's shared AI assets! Everything here is authored **once** and
generated for every tool we use (Copilot, Cursor, Windsurf, Claude Code, Kiro).

## Setup

```bash
npm install
```

## Add a skill

```bash
npm run skill:create -- --name dvt-my-skill
```

Edit `skills/dvt-my-skill/SKILL.md`:
- Keep the `name` matching the folder (lowercase-hyphen).
- Write a `description` that says **what it does and when to use it** (this is how the
  model decides to load it).
- Put long reference material in `references/` and link to it from `SKILL.md` — keep the
  main file short.

## Add an instruction

```bash
npm run instruction:create -- --name dvt-my-standard --activation glob --globs "**/*.ts"
```

Pick the right **activation**:
- `always` — applies in every conversation (org-wide conventions).
- `glob` — applies only to matching files (language/framework standards). Requires `globs`.
- `model` — the assistant loads it when relevant (description-driven).
- `manual` — only when explicitly referenced.

## Before opening a PR

```bash
npm run validate    # must pass (CI runs this)
npm run build       # regenerate README.md + llms.txt — commit the result
```

- Target the `main` branch with a focused, conventional-commit PR.
- Do **not** edit generated files (`README.md`, `llms.txt`, `website/public/data/*`).
- Optionally preview your asset on the site: `npm run website:dev`.

## Try the generated output

```bash
# See what a tool would receive, without writing anything:
npm run install:tool -- --tool cursor --dir /tmp/probe --dry-run
```

See [AGENTS.md](AGENTS.md) for the full format reference and the activation-mode mapping.
