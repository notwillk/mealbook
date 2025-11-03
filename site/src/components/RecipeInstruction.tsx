import type { Recipe } from "../types/schema";
import QrCode from "./QrCode";

type Props = {
  instruction: Exclude<Recipe["recipeInstructions"], string>[number];
};

export default function RecipeInstruction({ instruction }: Props) {
  const { text, name, url } =
    typeof instruction === "string" ? { text: instruction } : instruction;

  return (
    <li>
      {name && <strong>{name}</strong>}
      <p>{text}</p>
      {url && (
        <a href={url} target="_blank" rel="noreferrer">
          <QrCode url={url} ariaLabel={`QR code for ${url}`} />
        </a>
      )}
    </li>
  );
}
