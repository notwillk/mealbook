import type { Menu as MenuData } from "../types/schema";
import type { Menu as SchemaMenu, Restaurant } from "../types/generated/menu";

type Props = {
  menu: MenuData;
};

function isRestaurant(menu: MenuData): menu is Restaurant {
  return "hasMenu" in menu;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function countSections(menu: SchemaMenu): number {
  const sections = toArray(menu.hasMenuSection);
  return sections.length;
}

export default function MenuCard({ menu }: Props) {
  if (isRestaurant(menu)) {
    const menus = toArray(menu.hasMenu);
    const totalSections = menus.reduce(
      (sum, entry) => sum + countSections(entry),
      0
    );

    return (
      <span>
        <strong>{menu.name}</strong>
        {totalSections > 0 &&
          ` · ${totalSections} section${totalSections === 1 ? "" : "s"}`}
      </span>
    );
  }

  const sections = countSections(menu as SchemaMenu);
  const name = (menu as SchemaMenu).name ?? "Menu";

  return (
    <span>
      <strong>{name}</strong>
      {sections > 0 && ` · ${sections} section${sections === 1 ? "" : "s"}`}
    </span>
  );
}
