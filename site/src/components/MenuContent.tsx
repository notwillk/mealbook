import type { Menu as SchemaMenu } from "../types/generated/menu";
import MenuHeader from "./MenuHeader";
import MenuImages from "./MenuImages";
import MenuItems from "./MenuItems";
import MenuOffers from "./MenuOffers";
import MenuSections from "./MenuSections";

type Props = {
  menu: SchemaMenu;
  headingLevel: number;
};

function nextLevel(level: number): number {
  return Math.min(6, Math.max(1, level + 1));
}

export default function MenuContent({ menu, headingLevel }: Props) {
  const subsectionLevel = nextLevel(headingLevel);

  return (
    <section>
      <MenuHeader menu={menu} headingLevel={headingLevel} />
      <MenuImages image={menu.image} />
      <MenuOffers offers={menu.offers} headingLevel={subsectionLevel} />
      <MenuItems items={menu.hasMenuItem} headingLevel={subsectionLevel} />
      <MenuSections
        sections={menu.hasMenuSection}
        headingLevel={subsectionLevel}
      />
    </section>
  );
}
