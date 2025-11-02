import type { Menu } from "../types/schema";

type Props = {
  menu: Menu;
  url: string;
};

export default function MenuDetailPage({ menu, url }: Props) {
  return (
    <>
      <a href={url}>Source</a>
      <pre>{JSON.stringify(menu, null, 2)}</pre>
    </>
  );
}
