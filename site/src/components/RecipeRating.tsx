import type { Recipe } from "../types/schema";
import RecipeInteractionStatistic from "./RecipeInteractionStatistic";

type Props = {
  aggregateRating: Recipe["aggregateRating"];
};

export default function RecipeRating({ aggregateRating }: Props) {
  return aggregateRating ? (
    <li>
      <strong>Rating:</strong> {aggregateRating.ratingValue}
      {aggregateRating.ratingCount && ` (${aggregateRating.ratingCount})`}
    </li>
  ) : null;
}
