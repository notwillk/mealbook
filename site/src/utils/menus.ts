import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import type { Menu } from "../types/schema";
import { resolveRawBase } from "./git";
import { loadYamlCollection } from "./yaml";

export type Props = { data: Menu; url: string };

type MenuStaticPath = {
  params: { slug: string };
  props: Props;
};

const MENUS_DIR = fileURLToPath(new URL("../../../menus/", import.meta.url));

export async function getMenuStaticPaths(): Promise<MenuStaticPath[]> {
  const entries = await readdir(MENUS_DIR, { withFileTypes: true });
  const repoRoot = path.resolve(MENUS_DIR, "..");
  const rawBaseUrl = await resolveRawBase(repoRoot, "menus");

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && /\.menu\.ya?ml$/i.test(entry.name))
      .map(async (entry) => {
        const slug = entry.name.replace(/\.menu\.ya?ml$/i, "");
        const content = await readFile(
          path.join(MENUS_DIR, entry.name),
          "utf-8"
        );
        const data = YAML.parse(content) as Menu;
        return {
          params: { slug },
          props: { data, url: `${rawBaseUrl}${entry.name}` },
        };
      })
  );
}

export function loadMenus(): Promise<Record<string, Menu>> {
  return loadYamlCollection<Menu>(MENUS_DIR, /\.menu\.ya?ml$/i, (filename) =>
    filename.replace(/\.menu\.ya?ml$/i, "")
  );
}

export async function loadMenu(slug: string): Promise<Menu | null> {
  for (const extension of ["yaml", "yml"]) {
    const filename = `${slug}.menu.${extension}`;
    try {
      const content = await readFile(path.join(MENUS_DIR, filename), "utf-8");
      return YAML.parse(content) as Menu;
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
  return null;
}
