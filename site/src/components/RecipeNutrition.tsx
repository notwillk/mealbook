import type { Recipe } from "../types/schema";

type Props = {
  recipe: Recipe;
};

export default function RecipeNutrition({ recipe: { nutrition } }: Props) {
  const hasNutrition =
    nutrition?.calories ||
    nutrition?.fatContent ||
    nutrition?.carbohydrateContent ||
    nutrition?.proteinContent;

  return hasNutrition ? (
    <section className="recipe__nutrition">
      <h2>Nutrition</h2>
      <dl>
        {nutrition.calories && (
          <>
            <dt>Calories</dt>
            <dd>{nutrition.calories}</dd>
          </>
        )}
        {nutrition.fatContent && (
          <>
            <dt>Fat</dt>
            <dd>{nutrition.fatContent}</dd>
          </>
        )}
        {nutrition.carbohydrateContent && (
          <>
            <dt>Carbs</dt>
            <dd>{nutrition.carbohydrateContent}</dd>
          </>
        )}
        {nutrition.proteinContent && (
          <>
            <dt>Protein</dt>
            <dd>{nutrition.proteinContent}</dd>
          </>
        )}
      </dl>
    </section>
  ) : null;
}
