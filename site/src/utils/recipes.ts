import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import type { Recipe } from "../types/schema";
import { resolveRawBase } from "./git";
import { loadYamlCollection } from "./yaml";

export type Props = { data: Recipe; url: string };

type RecipeStaticPath = {
  params: { slug: string };
  props: Props;
};

const RECIPES_DIR = fileURLToPath(
  new URL("../../../recipes/", import.meta.url)
);

export async function getRecipeStaticPaths(): Promise<RecipeStaticPath[]> {
  const entries = await readdir(RECIPES_DIR, { withFileTypes: true });
  const repoRoot = path.resolve(RECIPES_DIR, "..");
  const rawBaseUrl = await resolveRawBase(repoRoot, "recipes");

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && /\.recipe\.ya?ml$/i.test(entry.name))
      .map(async (entry) => {
        const slug = entry.name.replace(/\.recipe\.ya?ml$/i, "");
        const content = await readFile(
          path.join(RECIPES_DIR, entry.name),
          "utf-8"
        );
        const data = YAML.parse(content) as Recipe;
        return {
          params: { slug },
          props: { data, url: `${rawBaseUrl}${entry.name}` },
        };
      })
  );
}

export function loadRecipes(): Promise<Record<string, Recipe>> {
  return loadYamlCollection<Recipe>(
    RECIPES_DIR,
    /\.recipe\.ya?ml$/i,
    (filename) => filename.replace(/\.recipe\.ya?ml$/i, "")
  );
}

export async function loadRecipe(slug: string): Promise<Recipe | null> {
  for (const extension of ["yaml", "yml"]) {
    const filename = `${slug}.recipe.${extension}`;
    try {
      const content = await readFile(path.join(RECIPES_DIR, filename), "utf-8");
      return YAML.parse(content) as Recipe;
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
  return null;
}
