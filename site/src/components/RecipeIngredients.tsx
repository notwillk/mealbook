import type { Recipe } from "../types/schema";
import RecipeIngredient from "./RecipeIngredient";

type Props = {
  recipe: Recipe;
};

export default function RecipeIngredients({
  recipe: { recipeIngredient },
}: Props) {
  return recipeIngredient.length > 0 ? (
    <section>
      <h2>Ingredients</h2>
      <ul>
        {recipeIngredient.map((ingredient, index) => (
          <RecipeIngredient ingredient={ingredient} key={index} />
        ))}
      </ul>
    </section>
  ) : null;
}
