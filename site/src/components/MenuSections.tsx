import type { MenuSection as SchemaMenuSection } from "../types/generated/menu";
import MenuSection from "./MenuSection";

type Props = {
  sections: SchemaMenuSection | SchemaMenuSection[];
  headingLevel: number;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export default function MenuSections({ sections, headingLevel }: Props) {
  const list = toArray(sections);

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="menu__sections">
      {list.map((section, index) => (
        <MenuSection
          key={`${section.name}-${index}`}
          section={section}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
