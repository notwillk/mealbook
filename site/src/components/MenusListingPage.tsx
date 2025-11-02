import type { Menu } from "../types/schema";

type Props = { menus: Record<string, Menu> };

export default function MenusListingPage({ menus }: Props) {
  return <pre>{JSON.stringify(menus, null, 2)}</pre>;
}
