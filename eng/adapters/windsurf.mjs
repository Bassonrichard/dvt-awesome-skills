// Windsurf adapter -> .windsurf/rules/<slug>.md (frontmatter: trigger, description, globs).
//   always -> trigger: always_on | glob -> trigger: glob + globs
//   model  -> trigger: model_decision (description) | manual -> trigger: manual
import { globList, skillAssetCopies, mdFile } from "./helpers.mjs";

export const id = "windsurf";

const TRIGGER = {
  always: "always_on",
  glob: "glob",
  model: "model_decision",
  manual: "manual",
};

export function transformSkill(skill) {
  const fm = { trigger: "model_decision", description: skill.description };
  return [
    mdFile(`.windsurf/rules/${skill.slug}.md`, fm, skill.body),
    ...skillAssetCopies(skill, `.windsurf/skills/${skill.slug}`),
  ];
}

export function transformInstruction(ins) {
  const fm = { trigger: TRIGGER[ins.activation] || "manual", description: ins.description };
  if (ins.activation === "glob") fm.globs = globList(ins.globs).join(",");
  return [mdFile(`.windsurf/rules/${ins.slug}.md`, fm, ins.body)];
}
