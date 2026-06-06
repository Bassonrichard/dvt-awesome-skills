import type { APIRoute } from "astro";
import instructionsData from "../../public/data/instructions.json";
import skillsData from "../../public/data/skills.json";
import { REPO_BASE_URL as REPO_RAW_BASE, REPO_GITHUB_BASE } from "../repo-config";

const normalizeDescription = (value?: string) =>
  (value || "No description available").replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const instructions = instructionsData.items;
  const skills = skillsData.items;
  const url = (path: string) => `${REPO_RAW_BASE}/${path}`;

  let content = "";
  content += "# DVT Awesome Skills\n\n";
  content +=
    "> DVT's internal, tool-agnostic collection of AI skills and coding instructions. Author once, generate for GitHub Copilot, Cursor, Windsurf, Claude Code, and Kiro.\n\n";

  content += "## Overview\n\n";
  content +=
    "- **Skills**: Self-contained capabilities with instructions and bundled resources\n";
  content +=
    "- **Instructions**: DVT coding standards applied by activation mode (always / file pattern / model-requested / manual)\n\n";

  content += "## Skills\n\n";
  for (const skill of skills) {
    content += `- [${skill.title}](${url(skill.skillFile)}): ${normalizeDescription(
      skill.description
    )}\n`;
  }
  content += "\n";

  content += "## Instructions\n\n";
  for (const instruction of instructions) {
    content += `- [${instruction.title}](${url(instruction.path)}): ${normalizeDescription(
      instruction.description
    )}\n`;
  }
  content += "\n";

  content += "## Repository\n\n";
  content += `- **GitHub**: ${REPO_GITHUB_BASE}\n`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
