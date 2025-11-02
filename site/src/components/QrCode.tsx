import QRCode from "qrcode";

type EC = "L" | "M" | "Q" | "H";

const svgCache = new Map<string, string | Promise<string>>();

function readSvg(key: string, factory: () => Promise<string>) {
  const cached = svgCache.get(key);
  if (cached) {
    if (typeof cached === "string") {
      return cached;
    }
    throw cached;
  }

  const promise = factory()
    .then((svg) => {
      svgCache.set(key, svg);
      return svg;
    })
    .catch((error) => {
      svgCache.delete(key);
      throw error;
    });

  svgCache.set(key, promise);
  throw promise;
}

export default function QrCode({
  url,
  size = 200,
  level = "M",
  margin = 4,
  dark = "#000000",
  light = "#ffffff",
  className,
  ariaLabel,
}: {
  url: string;
  size?: number;
  level?: EC;
  margin?: number;
  dark?: string;
  light?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const cacheKey = JSON.stringify({ url, size, level, margin, dark, light });
  const svg = readSvg(cacheKey, () =>
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: level,
      margin,
      width: size,
      color: { dark, light },
    }),
  );

  return (
    <div
      className={className}
      role="img"
      aria-label={ariaLabel ?? `QR code for ${url}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
