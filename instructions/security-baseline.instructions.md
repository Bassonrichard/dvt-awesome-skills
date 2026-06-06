---
description: 'DVT security baseline — load when handling auth, secrets, user input, or data access'
activation: model
metadata:
  tools: [copilot, cursor, windsurf, claude, kiro]
  category: security
---

# DVT Security Baseline

Apply when the work touches authentication, secrets, user input, or data access.

- Never hardcode secrets; read them from the secret manager and keep them out of logs.
- Validate and whitelist all external input at the trust boundary.
- Enforce least privilege for credentials, tokens, and database roles.
- Use parameterized queries; never build SQL by string concatenation.
- Authorize at the object level, not just the route level.
- Log security-relevant events (authn failures, authz denials) without logging PII or secrets.
- Keep dependencies patched; treat high/critical vulnerabilities as release blockers.
