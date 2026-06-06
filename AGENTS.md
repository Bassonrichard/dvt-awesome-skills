# AGENTS.md

Guidance for AI agents and humans working in this repository.

## What this repo is

`dvt-awesome-skills` is DVT's **tool-agnostic** collection of AI skills and coding
instructions. Assets are authored **once** in a canonical format and **generated**
into the native format of each supported tool:

**GitHub Copilot · Cursor · Windsurf · Claude Code · Kiro**

Modelled on [github/awesome-copilot](https://github.com/github/awesome-copilot), but
where awesome-copilot is Copilot-centric, this repo is multi-tool by design.

## Repository structure

```
skills/<name>/SKILL.md      # canonical skills (+ optional references/ assets)
instructions/<name>.instructions.md   # canonical coding standards
eng/                        # build + distribution tooling (Node .mjs)
  adapters/                 # one module per target tool (copilot, cursor, windsurf, claude, kiro)
  lib/                      # frontmatter parsing, asset loaders, constants
website/                    # Astro + Starlight site (like awesome-copilot's)
.schemas/                   # JSON schemas for frontmatter
```

## Canonical formats

### Skill — `skills/<name>/SKILL.md`
- `name` (required): lowercase-hyphen, matches folder, 2–64 chars.
- `description` (required): single-quoted, 10–1024 chars, says what + when.
- `metadata.tools` (optional): subset of tools to generate for. Omit = all.
- Heavy detail belongs in `references/` (progressive disclosure), not inline.

### Instruction — `instructions/<name>.instructions.md`
- `description` (required, single-quoted).
- `activation` (required): one of `always | glob | model | manual`.
- `globs` (required when `activation: glob`): comma-separated patterns.

### Activation modes map to every tool

| Canonical | Copilot | Cursor | Windsurf | Kiro |
|---|---|---|---|---|
| `always` | `applyTo: '**'` | `alwaysApply: true` | `trigger: always_on` | `inclusion: always` |
| `glob` | `applyTo: <globs>` | `globs: <globs>` | `trigger: glob` | `inclusion: fileMatch` |
| `model` | description-only | Agent Requested | `trigger: model_decision` | `inclusion: manual` |
| `manual` | omitted | `@rule` | `trigger: manual` | `inclusion: manual` |

Claude Code has no glob auto-apply for rules, so instructions become skills there.

## Commands

```bash
npm run skill:create -- --name my-skill
npm run instruction:create -- --name ts-standards --activation glob --globs "**/*.ts"
npm run validate          # CI gate: frontmatter, naming, globs, asset size
npm run build             # regenerate README.md + llms.txt
npm run install:tool -- --tool cursor --dir /path/to/repo   # generate native files
npm run website:dev       # run the internal website locally
npm run website:build     # generate data + build the Astro site
```

## Rules for changes

- Edit **canonical** assets in `skills/` and `instructions/`. Never hand-edit
  `README.md`, `llms.txt`, or `website/public/data/*` — they are generated.
- After changing assets, run `npm run validate` and `npm run build`.
- Adding a new tool = add `eng/adapters/<tool>.mjs` + one line in
  `eng/adapters/index.mjs` + the tool id in `eng/lib/constants.mjs`.
- File/folder names are lowercase-with-hyphens; descriptions are single-quoted.
