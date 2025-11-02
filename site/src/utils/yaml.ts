import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import YAML from 'yaml';

export async function loadYamlCollection<T>(
  directory: string,
  pattern: RegExp,
  toSlug: (filename: string) => string,
): Promise<Record<string, T>> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => {
      const slug = toSlug(entry.name);
      return {
        absolutePath: path.join(directory, entry.name),
        slug,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const pairs = await Promise.all(
    files.map(async ({ absolutePath, slug }) => {
      const content = await readFile(absolutePath, 'utf-8');
      const data = YAML.parse(content) as T;
      return [slug, data] as const;
    }),
  );

  return Object.fromEntries(pairs);
}
