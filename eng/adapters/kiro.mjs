// Kiro adapter -> .kiro/steering/<slug>.md (frontmatter: inclusion, fileMatchPattern).
//   always -> inclusion: always | glob -> inclusion: fileMatch + fileMatchPattern
//   model/manual -> inclusion: manual (loaded via #<slug>)
import { globList, skillAssetCopies, mdFile } from "./helpers.mjs";

export const id = "kiro";

export function transformSkill(skill) {
  return [
    mdFile(`.kiro/steering/${skill.slug}.md`, { inclusion: "manual" }, skill.body),
    ...skillAssetCopies(skill, `.kiro/skills/${skill.slug}`),
  ];
}

export function transformInstruction(ins) {
  const fm = {};
  if (ins.activation === "always") fm.inclusion = "always";
  else if (ins.activation === "glob") {
    fm.inclusion = "fileMatch";
    // Kiro fileMatchPattern is a single glob; use the first canonical pattern.
    fm.fileMatchPattern = globList(ins.globs)[0] || "**/*";
  } else fm.inclusion = "manual";
  return [mdFile(`.kiro/steering/${ins.slug}.md`, fm, ins.body)];
}
