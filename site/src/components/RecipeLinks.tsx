import type { Recipe } from "../types/schema";
import ExternalLink from "./ExternalLink";
import QrCode from "./QrCode";

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
    <>
      {url && <ExternalLink url={url} text="Recipe sourcecode" />}
      {recipeUrl && <ExternalLink url={recipeUrl} text="Inspiration website" />}
      {authorUrl && <ExternalLink url={authorUrl} text="Author website" />}
    </>
  ) : null;
}
