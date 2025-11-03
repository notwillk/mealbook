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
      <div className="bg-background rounded-lg bg-green-200 shadow-md border border-border/20 p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl text-green-800 font-bold text-foreground text-balance">
          {menu.name}
          {totalSections > 0 &&
            ` · ${totalSections} section${totalSections === 1 ? "" : "s"}`}
        </h2>
      </div>
    );
  }

  const sections = countSections(menu as SchemaMenu);
  const name = (menu as SchemaMenu).name ?? "Menu";

  return (
    <div className="bg-background bg-green-200 rounded-lg shadow-md border border-border/20 p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl text-green-800 font-bold text-foreground text-balance">
        {name}
        {sections > 0 && ` · ${sections} section${sections === 1 ? "" : "s"}`}
      </h2>
    </div>
  );
}
