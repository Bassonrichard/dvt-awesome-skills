---
name: dvt-secure-api-review
description: Use when reviewing a DVT REST or GraphQL API against the company security baseline before release. Walks authn/authz, input validation, rate limiting, secrets, and logging.
---

# DVT Secure API Review

Review an API surface against DVT's security baseline before it ships.

## When to use this skill

Use this skill when you need to:
- Review a new or changed API endpoint before merge/release.
- Produce a short, actionable security findings list.

## Review checklist

1. **Authentication** — every non-public route requires a verified identity; tokens validated (signature, expiry, audience).
2. **Authorization** — object-level checks (the caller can act on *this* resource), not just route-level.
3. **Input validation** — all inputs validated/whitelisted at the boundary; reject unknown fields.
4. **Rate limiting & abuse** — sensitive/unauthenticated endpoints are rate-limited.
5. **Secrets** — no secrets in code, logs, or responses; pulled from the secret manager.
6. **Errors & logging** — errors don't leak internals; logs exclude PII and credentials.
7. **Transport** — TLS enforced; secure headers set.

## Output

Produce findings as: `Severity (high/med/low) — Endpoint — Issue — Recommended fix`.
