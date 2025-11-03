import type { Recipe } from "../types/schema";
import { getRecipeUrl } from "../utils/urls";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Record<string, Recipe>;
};

export default function Recipes({ recipes }: Props) {
  return (
    <ul>
      {Object.entries(recipes).map(([slug, recipe]) => (
        <li key={slug}>
          <a href={getRecipeUrl(slug)}>
            <RecipeCard recipe={recipe} />
          </a>
        </li>
      ))}
    </ul>
  );
}
