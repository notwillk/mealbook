import React from "react";
import type { Menu } from "../types/schema";
import Menus from "./Menus";

type Props = { menus: Record<string, Menu> };

export default function MenusListingPage({ menus }: Props) {
  return (
    <React.Suspense fallback={null}>
      <Menus menus={menus} />
    </React.Suspense>
  );
}
