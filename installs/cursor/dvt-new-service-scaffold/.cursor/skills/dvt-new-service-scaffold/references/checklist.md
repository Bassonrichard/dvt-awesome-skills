# New Service — Pre-merge Checklist

- [ ] `domain/` has zero imports from `api/` or `infra/`.
- [ ] `/healthz` and `/readyz` implemented and covered by a test.
- [ ] Structured JSON logs include `correlation_id`, `service`, `level`.
- [ ] Config is typed and validated at startup; the service fails fast on missing/invalid config.
- [ ] Secrets come from the secret manager, never from committed files.
- [ ] CI runs lint, tests, build, and a container image scan.
- [ ] README documents how to run locally and the required env vars.
