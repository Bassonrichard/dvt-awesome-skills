// GitHub Copilot adapter.
// Skills      -> .github/skills/<slug>/SKILL.md (+ bundled assets)
// Instructions-> .github/instructions/<slug>.instructions.md with `applyTo`
//   always -> applyTo '**'   | glob -> applyTo <globs>   | model/manual -> description only
import { globList, skillAssetCopies, mdFile } from "./helpers.mjs";

export const id = "copilot";

export function transformSkill(skill) {
  const dir = `.github/skills/${skill.slug}`;
  return [
    mdFile(`${dir}/SKILL.md`, { name: skill.name, description: skill.description }, skill.body),
    ...skillAssetCopies(skill, dir),
  ];
}

export function transformInstruction(ins) {
  const fm = { description: ins.description };
  if (ins.activation === "always") fm.applyTo = "**";
  else if (ins.activation === "glob") fm.applyTo = globList(ins.globs).join(", ");
  // model / manual: description only (Agent picks it up by relevance / explicit reference).
  return [mdFile(`.github/instructions/${ins.slug}.instructions.md`, fm, ins.body)];
}
