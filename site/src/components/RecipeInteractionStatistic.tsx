import type { Recipe } from "../types/schema";

type Props = {
  interactionStatistic: Recipe["interactionStatistic"];
};

export default function RecipeInteractionStatistic({
  interactionStatistic,
}: Props) {
  const userInteractionCount = interactionStatistic?.userInteractionCount;
  const interactionType = interactionStatistic?.interactionType;

  return userInteractionCount && interactionType ? (
    <li>
      <strong>Interactions:</strong>
      {userInteractionCount} ({interactionType})
    </li>
  ) : null;
}
