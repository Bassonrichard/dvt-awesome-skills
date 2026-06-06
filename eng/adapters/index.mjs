// Adapter registry. Adding a new tool = add one module + one line here.
import * as copilot from "./copilot.mjs";
import * as cursor from "./cursor.mjs";
import * as windsurf from "./windsurf.mjs";
import * as claude from "./claude.mjs";
import * as kiro from "./kiro.mjs";

export const ADAPTERS = { copilot, cursor, windsurf, claude, kiro };

export function getAdapter(tool) {
  const adapter = ADAPTERS[tool];
  if (!adapter) throw new Error(`No adapter for tool '${tool}'`);
  return adapter;
}
