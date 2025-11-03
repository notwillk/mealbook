import type { Menu } from "../types/schema";
import { getMenuUrl } from "../utils/urls";
import MenuCard from "./MenuCard";

type Props = {
  menus: Record<string, Menu>;
};

export default function Menus({ menus }: Props) {
  return (
    <ul className="menus">
      {Object.entries(menus).map(([slug, menu]) => (
        <li key={slug}>
          <a href={getMenuUrl(slug)}>
            <MenuCard menu={menu} />
          </a>
        </li>
      ))}
    </ul>
  );
}
