import type { Menu as MenuData } from "../types/schema";
import type {
  Menu as SchemaMenu,
  Restaurant,
} from "../types/generated/menu";
import MenuContent from "./MenuContent";
import MenuLinks from "./MenuLinks";
import MenuRestaurantHeader from "./MenuRestaurantHeader";

type Props = {
  menu: MenuData;
  url: string | null;
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

export default function Menu({ menu, url }: Props) {
  if (isRestaurant(menu)) {
    const menus = toArray(menu.hasMenu);
    return (
      <article className="menu menu--restaurant">
        <MenuRestaurantHeader restaurant={menu} />
        <MenuLinks rawUrl={url} sourceUrl={menu.url ?? null} />
        {menus.map((entry, index) => (
          <MenuContent
            key={entry.name ?? `menu-${index}`}
            menu={entry}
            headingLevel={2}
          />
        ))}
      </article>
    );
  }

  return (
    <article className="menu">
      <MenuContent menu={menu as SchemaMenu} headingLevel={1} />
      <MenuLinks rawUrl={url} />
    </article>
  );
}
