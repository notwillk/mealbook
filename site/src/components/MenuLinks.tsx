import QrCode from "./QrCode";

type Props = {
  rawUrl: string | null;
  sourceUrl?: string | null;
};

export default function MenuLinks({ rawUrl, sourceUrl }: Props) {
  if (!rawUrl && !sourceUrl) {
    return null;
  }

  return (
    <div className="menu__links">
      {rawUrl && (
        <a href={rawUrl} target="_blank" rel="noreferrer">
          Menu definition:
          <QrCode url={rawUrl} ariaLabel={`QR code for ${rawUrl}`} />
        </a>
      )}
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noreferrer">
          Restaurant site:
          <QrCode url={sourceUrl} ariaLabel={`QR code for ${sourceUrl}`} />
        </a>
      )}
    </div>
  );
}
