import type { Recipe } from "../types/schema";
import { getRecipeUrl } from "../utils/urls";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Record<string, Recipe>;
};

export default function Recipes({ recipes }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 w-full p-6">
      {Object.entries(recipes).map(([slug, recipe]) => (
        <a key={slug} href={getRecipeUrl(slug)}>
          <RecipeCard recipe={recipe} />
        </a>
      ))}
    </div>
  );
}
