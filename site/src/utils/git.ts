import path from "node:path";
import { readFile } from "node:fs/promises";

export async function resolveRawBase(repoRoot: string, subdir: string) {
  const configPath = path.join(repoRoot, ".git/config");
  const headPath = path.join(repoRoot, ".git/HEAD");

  const configContent = await readFile(configPath, "utf-8");
  const originMatch = configContent.match(/^\s*url\s*=\s*(.+)$/m);
  if (!originMatch) {
    throw new Error("Git remote origin URL not found");
  }
  const originUrl = originMatch[1].trim();

  let repoPath = "";
  if (originUrl.startsWith("git@github.com:")) {
    repoPath = originUrl.slice("git@github.com:".length);
  } else if (originUrl.startsWith("https://github.com/")) {
    repoPath = originUrl.slice("https://github.com/".length);
  } else {
    throw new Error(`Unsupported Git remote URL format: ${originUrl}`);
  }
  repoPath = repoPath.replace(/\.git$/, "");

  const headContent = await readFile(headPath, "utf-8");
  const refMatch = headContent.match(/ref:\s+refs\/heads\/([^\s]+)/);
  const branch = refMatch ? refMatch[1] : headContent.trim();

  return `https://github.com/${repoPath}/blob/${branch}/${subdir}/`;
}
