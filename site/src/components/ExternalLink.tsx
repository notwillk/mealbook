import QrCode from "./QrCode";

type Props = {
  url: string;
  text: string;
};

export default function ExternalLink({ url, text }: Props) {
  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="print:hidden text-primary hover:underline text-sm"
      >
        {text}
      </a>
      <QrCode
        className="hidden print:inline-flex"
        url={url}
        ariaLabel={`QR code for ${text}`}
      />
    </>
  );
}
