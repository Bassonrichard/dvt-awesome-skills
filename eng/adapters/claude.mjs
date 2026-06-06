// Claude Code adapter.
// Skills       -> .claude/skills/<slug>/SKILL.md (+ bundled assets) — native.
// Instructions -> .claude/skills/<slug>/SKILL.md  (Claude has no glob auto-apply for rules,
//                 so each instruction becomes a skill the model loads by relevance; the
//                 advisory glob is recorded in the body). `always` instructions are ALSO
//                 aggregated into .claude/dvt-instructions.md for @-import into CLAUDE.md.
import { skillAssetCopies, mdFile } from "./helpers.mjs";

export const id = "claude";

export function transformSkill(skill) {
  const dir = `.claude/skills/${skill.slug}`;
  return [
    mdFile(`${dir}/SKILL.md`, { name: skill.name, description: skill.description }, skill.body),
    ...skillAssetCopies(skill, dir),
  ];
}

export function transformInstruction(ins) {
  const note =
    ins.activation === "glob"
      ? `> Applies to files matching: \`${ins.globs}\`\n\n`
      : "";
  return [
    mdFile(
      `.claude/skills/${ins.slug}/SKILL.md`,
      { name: ins.slug, description: ins.description },
      note + ins.body
    ),
  ];
}
