/**
 * Single source of truth for this repo's identity. Change these two values
 * (and the matching block in eng/lib/constants.mjs) to move the project to a
 * new owner, repo name, or self-hosted git host — everything else derives.
 */
export const REPO_OWNER = "bassonrichard";
export const REPO_NAME = "dvt-awesome-skills";
export const REPO_DEFAULT_BRANCH = "main";

/** `owner/name`, e.g. used by `gh skill install <owner/name>`. */
export const REPO_IDENTIFIER = `${REPO_OWNER}/${REPO_NAME}`;

/** Base for the GitHub project (issues, blob, etc.). */
export const REPO_GITHUB_BASE = `https://github.com/${REPO_IDENTIFIER}`;

/** Clone URL for `git clone`. */
export const REPO_HTTPS_URL = `${REPO_GITHUB_BASE}.git`;

/** Raw file base, e.g. `${REPO_BASE_URL}/skills/foo/SKILL.md`. */
export const REPO_BASE_URL = `https://raw.githubusercontent.com/${REPO_IDENTIFIER}/${REPO_DEFAULT_BRANCH}`;

/** Blob (web view) base, e.g. `${REPO_GITHUB_URL}/skills/foo/SKILL.md`. */
export const REPO_GITHUB_URL = `${REPO_GITHUB_BASE}/blob/${REPO_DEFAULT_BRANCH}`;
