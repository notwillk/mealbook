import type { Recipe } from "../types/schema";
// import { QrCode } from "./QrCode";

type Props = {
  recipe: Recipe;
  url: string;
};

export default function Recipe({ recipe, url }: Props) {
  return (
    <>
      <a href={url}>
        {url}
        {/* <QrCode value={url} ariaLabel={`QR code for ${recipe.name}`} /> */}
      </a>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </>
  );
}
