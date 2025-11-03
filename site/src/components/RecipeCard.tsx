import type { Recipe } from "../types/schema";

type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe: { name } }: Props) {
  return <span>{name}</span>;
}
