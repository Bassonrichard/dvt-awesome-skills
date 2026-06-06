---
description: 'DVT TypeScript coding standards for application and service code'
activation: glob
globs: '**/*.ts, **/*.tsx'
metadata:
  tools: [copilot, cursor, windsurf, claude, kiro]
  category: language
---

# DVT TypeScript Standards

Apply these when writing or reviewing TypeScript.

- Enable `strict` mode; do not use `any` — prefer `unknown` and narrow.
- Model domain types explicitly; avoid stringly-typed APIs.
- Prefer pure functions and dependency injection over module-level singletons.
- Handle errors explicitly; never swallow a caught error silently.
- Validate external input (HTTP bodies, env, third-party responses) at the boundary.
- Name things for intent, not implementation; keep functions small and single-purpose.
- Co-locate tests with the code they cover; cover the unhappy paths.
