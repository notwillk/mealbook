import type { Recipe } from "../types/schema";
import ExternalLink from "./ExternalLink";

type Props = {
  recipe: Recipe;
  url: string | null;
};

export default function RecipeLinks({
  recipe: { author, url: recipeUrl },
  url,
}: Props) {
  const authorUrl = typeof author === "object" ? author.url : undefined;

  const hasLinks = Boolean(url || recipeUrl || authorUrl);

  return hasLinks ? (
    <div className="flex flex-row gap-6 mt-4">
      {url && <ExternalLink url={url} text="Recipe sourcecode →" />}
      {recipeUrl && <ExternalLink url={recipeUrl} text="Inspiration →" />}
      {authorUrl && <ExternalLink url={authorUrl} text="Author's website →" />}
    </div>
  ) : null;
}
