import React from "react";
import type { Menu as MenuSchema } from "../types/schema";
import Menu from "./Menu";

type Props = {
  menu: MenuSchema;
  url: string;
};

export default function MenuDetailPage({ menu, url }: Props) {
  return (
    <React.Suspense fallback={null}>
      <Menu menu={menu} url={url} />
    </React.Suspense>
  );
}
