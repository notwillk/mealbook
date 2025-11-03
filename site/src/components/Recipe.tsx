import type { Recipe } from "../types/schema";
import RecipeDetails from "./RecipeDetails";
import RecipeHeader from "./RecipeHeader";
import RecipeImages from "./RecipeImages";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import RecipeLinks from "./RecipeLinks";
import RecipeMetrics from "./RecipeMetrics";
import RecipeNutrition from "./RecipeNutrition";
import RecipeTiming from "./RecipeTiming";

type Props = {
  recipe: Recipe;
  url: string | null;
};

export default function Recipe({ recipe, url }: Props) {
  return (
    <article>
      <RecipeHeader recipe={recipe} />
      <RecipeTiming recipe={recipe} />
      <RecipeNutrition recipe={recipe} />
      <RecipeIngredients recipe={recipe} />
      <RecipeInstructions recipe={recipe} />
      <RecipeDetails recipe={recipe} />
      <RecipeMetrics recipe={recipe} />
      <RecipeImages recipe={recipe} />
      <RecipeLinks recipe={recipe} url={url} />
    </article>
  );
}
