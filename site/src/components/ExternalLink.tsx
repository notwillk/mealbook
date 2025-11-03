import QrCode from "./QrCode";

type Props = {
  url: string;
  text: string;
};

export default function ExternalLink({ url, text }: Props) {
  // todo: hide the text when printed, hide the QR code on screen
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <span>{text}</span>
      <QrCode url={url} ariaLabel={`QR code for ${text}`} />
    </a>
  );
}
