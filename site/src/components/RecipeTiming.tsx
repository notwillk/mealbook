import { parse as parseIsoDuration } from "iso8601-duration";
import type { Recipe } from "../types/schema";
import RecipeDetailItem from "./RecipeDetailItem";

type Props = {
  recipe: Recipe;
};

function formatDuration(iso: string): string {
  try {
    const duration = parseIsoDuration(iso);
    const trimmed = iso[0] === "+" || iso[0] === "-" ? iso.slice(1) : iso;
    if (!trimmed.startsWith("P")) {
      return iso;
    }

    const [, datePartRaw = "", timePartRaw = ""] =
      trimmed.match(/^P([^T]*)(?:T(.*))?$/) ?? [];
    const datePart = datePartRaw ?? "";
    const timePart = timePartRaw ?? "";

    const entries: Array<{
      value: number | undefined;
      label: string;
      present: boolean;
    }> = [
      {
        value: duration.years,
        label: "year",
        present: /(\d+(?:\.\d+)?)Y/.test(datePart),
      },
      {
        value: duration.months,
        label: "month",
        present: /(\d+(?:\.\d+)?)M/.test(datePart),
      },
      {
        value: duration.weeks,
        label: "week",
        present: /(\d+(?:\.\d+)?)W/.test(datePart),
      },
      {
        value: duration.days,
        label: "day",
        present: /(\d+(?:\.\d+)?)D/.test(datePart),
      },
      {
        value: duration.hours,
        label: "hour",
        present: /(\d+(?:\.\d+)?)H/.test(timePart),
      },
      {
        value: duration.minutes,
        label: "min",
        present: /(\d+(?:\.\d+)?)M/.test(timePart),
      },
      {
        value: duration.seconds,
        label: "sec",
        present: /(\d+(?:\.\d+)?)S/.test(timePart),
      },
    ];

    const parts = entries
      .filter(
        ({ value, present }) => present || (value !== undefined && value !== 0)
      )
      .map(({ value, label }) => {
        const numeric = value ?? 0;
        return `${numeric} ${label}${numeric === 1 ? "" : "s"}`;
      });

    return parts.length > 0 ? parts.join(" ") : iso;
  } catch (error) {
    console.error("Error parsing ISO 8601 duration:", error);
    return iso;
  }
}

export default function RecipeTiming({ recipe }: Props) {
  const hasTiming = Boolean(
    [recipe.prepTime, recipe.cookTime, recipe.totalTime].find(Boolean)
  );

  return hasTiming ? (
    <section>
      <h2>Timing</h2>
      <dl>
        {recipe.prepTime && (
          <RecipeDetailItem title="Prep Time">
            {formatDuration(recipe.prepTime)}
          </RecipeDetailItem>
        )}
        {recipe.cookTime && (
          <RecipeDetailItem title="Cook Time">
            {formatDuration(recipe.cookTime)}
          </RecipeDetailItem>
        )}
        {recipe.totalTime && (
          <RecipeDetailItem title="Total Time">
            {formatDuration(recipe.totalTime)}
          </RecipeDetailItem>
        )}
      </dl>
    </section>
  ) : null;
}
