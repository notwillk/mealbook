import type { Recipe } from "../types/schema";

type Props = {
  ingredient: Recipe["recipeIngredient"][number];
};

export default function RecipeIngredients({ ingredient }: Props) {
  const { name, value, unitCode } =
    typeof ingredient === "string" ? { name: ingredient } : ingredient;

  return (
    <li>
      {value && <strong>{[value, unitCode].filter(Boolean).join(" ")}</strong>}
      {": "}
      {name}
    </li>
  );
}
