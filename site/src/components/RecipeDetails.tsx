import type { Recipe } from "../types/schema";
import RecipeDetailItem from "./RecipeDetailItem";

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({ recipe }: Props) {
  const keywords = recipe.keywords ? [recipe.keywords].flat() : [];
  const hasDetails = Boolean(
    [
      recipe.recipeCategory,
      recipe.recipeCuisine,
      recipe.inLanguage,
      recipe.recipeYield,
      recipe.suitableForDiet,
      recipe.datePublished,
      keywords.length > 0,
    ].find(Boolean)
  );

  return hasDetails ? (
    <section>
      <h2>Details</h2>
      <dl>
        {recipe.recipeCategory && (
          <RecipeDetailItem title="Category">
            {recipe.recipeCategory}
          </RecipeDetailItem>
        )}
        {recipe.recipeCuisine && (
          <RecipeDetailItem title="Cuisine">
            {recipe.recipeCuisine}
          </RecipeDetailItem>
        )}
        {recipe.inLanguage && (
          <RecipeDetailItem title="Language">
            {recipe.inLanguage}
          </RecipeDetailItem>
        )}
        {recipe.suitableForDiet && (
          <RecipeDetailItem title="Diet">
            {recipe.suitableForDiet}
          </RecipeDetailItem>
        )}
        {recipe.datePublished && (
          <RecipeDetailItem title="Published">
            {recipe.datePublished}
          </RecipeDetailItem>
        )}
        {keywords.length > 0 && (
          <RecipeDetailItem title="Keywords">
            <ul>
              {keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </RecipeDetailItem>
        )}
      </dl>
    </section>
  ) : null;
}
