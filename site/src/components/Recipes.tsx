import type { Recipe } from "../types/schema";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Record<string, Recipe>;
};

export default function Recipes({ recipes }: Props) {
  return (
    <ul className="recipes">
      {Object.entries(recipes).map(([slug, recipe]) => (
        <li key={slug}>
          <a href={`/recipes/${slug}`}>
            <RecipeCard recipe={recipe} />
          </a>
        </li>
      ))}
    </ul>
  );
}
