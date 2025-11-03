import type { Recipe } from "../types/schema";
import RecipeInteractionStatistic from "./RecipeInteractionStatistic";
import RecipeRating from "./RecipeRating";

type Props = {
  recipe: Recipe;
};

export default function RecipeMetrics({
  recipe: { aggregateRating, interactionStatistic },
}: Props) {
  return aggregateRating || interactionStatistic ? (
    <section className="recipe__metrics">
      <h2>Metrics</h2>
      <ul>
        <RecipeRating aggregateRating={aggregateRating} />
        <RecipeInteractionStatistic
          interactionStatistic={interactionStatistic}
        />
      </ul>
    </section>
  ) : null;
}
