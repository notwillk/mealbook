import type { Recipe } from "../types/schema";

type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe: { name } }: Props) {
  return (
    <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow bg-green-200">
      <h2 className="text-xl font-bold text-green-800 text-balance">{name}</h2>
    </div>
  );
}
