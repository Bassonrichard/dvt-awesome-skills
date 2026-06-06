// Shared constants for the dvt-awesome-skills tooling.
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..", "..");
export const SKILLS_DIR = path.join(ROOT_DIR, "skills");
export const INSTRUCTIONS_DIR = path.join(ROOT_DIR, "instructions");
export const DIST_DIR = path.join(ROOT_DIR, "dist");

// Supported target tools. Adding a new tool = add its id here + an adapter module.
export const TOOLS = ["copilot", "cursor", "windsurf", "claude", "kiro"];

// Instruction activation modes (canonical). Each adapter maps these to native concepts.
export const ACTIVATION_MODES = ["always", "glob", "model", "manual"];

// Validation limits (aligned with the Agent Skills specification).
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 64;
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 1024;
export const MAX_ASSET_BYTES = 5 * 1024 * 1024; // 5MB per bundled file

export const NAME_PATTERN = /^[a-z0-9-]+$/;
