import type { Recipe as RecipeSchema } from "../types/schema";
import Recipe from "./Recipe";

type Props = {
  recipe: RecipeSchema;
  url: string;
};

export default function RecipeDetailPage({ recipe, url }: Props) {
  return <Recipe recipe={recipe} url={url} />;
}
