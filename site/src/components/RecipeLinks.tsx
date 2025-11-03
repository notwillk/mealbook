import type { Recipe } from "../types/schema";
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
      {url && (
        <a href={url} className="recipe__qr" target="_blank" rel="noreferrer">
          Recipe definition URL:
          <QrCode url={url} ariaLabel={`QR code for ${url}`} />
        </a>
      )}
      {recipeUrl && (
        <a
          href={recipeUrl}
          className="recipe__qr"
          target="_blank"
          rel="noreferrer"
        >
          Inspiration URL:
          <QrCode url={recipeUrl} ariaLabel={`QR code for ${recipeUrl}`} />
        </a>
      )}
      {authorUrl && (
        <a
          href={authorUrl}
          className="recipe__qr"
          target="_blank"
          rel="noreferrer"
        >
          Author URL:
          <QrCode url={authorUrl} ariaLabel={`QR code for ${authorUrl}`} />
        </a>
      )}
    </>
  ) : null;
}
