import type { Menu } from "../types/schema";
import { getMenuUrl } from "../utils/urls";
import MenuCard from "./MenuCard";

type Props = {
  menus: Record<string, Menu>;
};

export default function Menus({ menus }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 w-full p-6">
      {Object.entries(menus).map(([slug, menu]) => (
        <a key={slug} href={getMenuUrl(slug)}>
          <MenuCard menu={menu} />
        </a>
      ))}
    </div>
  );
}
