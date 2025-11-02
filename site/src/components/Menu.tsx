import type { Menu } from "../types/schema";
import QrCode from "./QrCode";

type Props = {
  menu: Menu;
  url: string | null;
};

export default function Menu({ menu, url }: Props) {
  return (
    <>
      {url && (
        <a href={url}>
          <QrCode url={url} ariaLabel={`QR code for ${url}`} />
        </a>
      )}
      <pre>{JSON.stringify(menu, null, 2)}</pre>
    </>
  );
}
