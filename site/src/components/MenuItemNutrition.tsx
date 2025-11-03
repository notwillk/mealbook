import type { NutritionInformation } from "../types/generated/menu";

type Props = {
  nutrition?: NutritionInformation;
};

export default function MenuItemNutrition({ nutrition }: Props) {
  if (
    !nutrition ||
    (!nutrition.calories &&
      !nutrition.fatContent &&
      !nutrition.fiberContent &&
      !nutrition.proteinContent)
  ) {
    return null;
  }

  return (
    <dl className="menu-item__nutrition">
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
      {nutrition.fiberContent && (
        <>
          <dt>Fiber</dt>
          <dd>{nutrition.fiberContent}</dd>
        </>
      )}
      {nutrition.proteinContent && (
        <>
          <dt>Protein</dt>
          <dd>{nutrition.proteinContent}</dd>
        </>
      )}
    </dl>
  );
}
