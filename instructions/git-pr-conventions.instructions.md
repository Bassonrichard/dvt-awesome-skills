---
description: 'DVT git and pull request conventions that always apply across repositories'
activation: always
metadata:
  tools: [copilot, cursor, windsurf, claude, kiro]
  category: process
---

# DVT Git & PR Conventions

Always follow these when committing or opening pull requests.

- Use Conventional Commits: `type(scope): summary` (e.g. `feat(api): add health endpoint`).
- Keep PRs small and focused on one change; describe the *why*, not just the *what*.
- Branch from `main`; never commit directly to `main`.
- All checks (lint, tests, build) must pass before requesting review.
- Squash-merge with a clean, conventional title.
- Reference the relevant ticket in the PR description.
