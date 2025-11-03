import React from "react";
import type { MenuItem as SchemaMenuItem } from "../types/generated/menu";
import MenuImages from "./MenuImages";
import MenuItemNutrition from "./MenuItemNutrition";
import MenuOffers from "./MenuOffers";

type Props = {
  item: SchemaMenuItem;
  headingLevel: number;
};

function clampHeading(level: number): number {
  return Math.min(6, Math.max(1, level));
}

export default function MenuItem({ item, headingLevel }: Props) {
  const Heading = `h${clampHeading(headingLevel)}`;
  const diets = item.suitableForDiet
    ? Array.isArray(item.suitableForDiet)
      ? item.suitableForDiet
      : [item.suitableForDiet]
    : [];

  return (
    <li>
      {React.createElement(Heading, null, item.name)}
      {item.description && <p>{item.description}</p>}
      <MenuImages image={item.image} />
      {diets.length > 0 && (
        <p>
          Suitable for:{" "}
          {diets.map((diet, index) => (
            <span key={`${diet}-${index}`}>
              {diet}
              {index < diets.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}
      <MenuItemNutrition nutrition={item.nutrition} />
      <MenuOffers
        offers={item.offers}
        headingLevel={clampHeading(headingLevel + 1)}
        showHeading={false}
      />
    </li>
  );
}
