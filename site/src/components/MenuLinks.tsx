import ExternalLink from "./ExternalLink";
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
    <div className="flex flex-row gap-6 mt-4">
      {rawUrl && <ExternalLink url={rawUrl} text="Menu sourcecode →" />}
      {sourceUrl && <ExternalLink url={sourceUrl} text="Menu website →" />}
    </div>
  );
}
