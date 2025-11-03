import type { Recipe } from "../types/schema";
import ExternalLink from "./ExternalLink";
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
      {url && <ExternalLink url={url} text="Instruction website" />}
    </li>
  );
}
