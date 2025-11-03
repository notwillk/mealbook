import type { Recipe } from "../types/schema";
import RecipeInstruction from "./RecipeInstruction";

type Props = {
  recipe: Recipe;
};

export default function RecipeInstructions({
  recipe: { recipeInstructions },
}: Props) {
  const instructions =
    typeof recipeInstructions === "string"
      ? [{ text: recipeInstructions }]
      : recipeInstructions;

  return instructions.length > 0 ? (
    <section className="recipe__instructions">
      <h2>Instructions</h2>
      <ol>
        {instructions.map((instruction, index) => (
          <RecipeInstruction instruction={instruction} key={index} />
        ))}
      </ol>
    </section>
  ) : null;
}
