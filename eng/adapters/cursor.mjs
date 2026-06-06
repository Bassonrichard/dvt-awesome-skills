// Cursor adapter -> .cursor/rules/<slug>.mdc (MDC: description, globs, alwaysApply).
//   always -> alwaysApply:true | glob -> globs set | model -> description-only (Agent Requested) | manual -> @-invoked
// Skills are emitted as Agent-Requested rules; bundled assets copied alongside for reference.
import { globList, skillAssetCopies, mdFile } from "./helpers.mjs";

export const id = "cursor";

export function transformSkill(skill) {
  const fm = { description: skill.description, alwaysApply: false };
  return [
    mdFile(`.cursor/rules/${skill.slug}.mdc`, fm, skill.body),
    ...skillAssetCopies(skill, `.cursor/skills/${skill.slug}`),
  ];
}

export function transformInstruction(ins) {
  const fm = { description: ins.description, alwaysApply: ins.activation === "always" };
  if (ins.activation === "glob") fm.globs = globList(ins.globs).join(",");
  return [mdFile(`.cursor/rules/${ins.slug}.mdc`, fm, ins.body)];
}
