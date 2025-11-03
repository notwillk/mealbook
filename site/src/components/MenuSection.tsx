import React from "react";
import type { MenuSection as SchemaMenuSection } from "../types/generated/menu";
import MenuImages from "./MenuImages";
import MenuItems from "./MenuItems";
import MenuOffers from "./MenuOffers";

type Props = {
  section: SchemaMenuSection;
  headingLevel: number;
};

function clampHeading(level: number): number {
  return Math.min(6, Math.max(1, level));
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export default function MenuSection({ section, headingLevel }: Props) {
  const Heading = `h${clampHeading(headingLevel)}`;
  const nextLevel = clampHeading(headingLevel + 1);
  const subSections = toArray(section.hasMenuSection);

  return (
    <section>
      {React.createElement(Heading, null, section.name)}
      {section.description && <p>{section.description}</p>}
      <MenuImages image={section.image} />
      <MenuOffers offers={section.offers} headingLevel={nextLevel} />
      <MenuItems items={section.hasMenuItem} headingLevel={nextLevel} />
      {subSections.length > 0 && (
        <div>
          {subSections.map((subSection, index) => (
            <MenuSection
              key={`${subSection.name}-${index}`}
              section={subSection}
              headingLevel={nextLevel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
