import React from "react";
import type { Recipe } from "../types/schema";
import Recipes from "./Recipes";

type Props = { recipes: Record<string, Recipe> };

export default function RecipesListingPage({ recipes }: Props) {
  return (
    <React.Suspense fallback={null}>
      <Recipes recipes={recipes} />
    </React.Suspense>
  );
}
