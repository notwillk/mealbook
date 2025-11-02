import type { Recipe } from "../types/schema";

type Props = { recipes: Record<string, Recipe> };

export default function RecipesListingPage({ recipes }: Props) {
  return <pre>{JSON.stringify(recipes, null, 2)}</pre>;
}
