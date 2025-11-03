type Props = {
  image?: string | string[];
};

function toUniqueList(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }
  const images = Array.isArray(value) ? value : [value];
  return Array.from(new Set(images.filter(Boolean)));
}

export default function MenuImages({ image }: Props) {
  const images = toUniqueList(image);

  return images.length > 0 ? (
    <ul>
      {images.map((src) => (
        <li key={src}>
          <img src={src} loading="lazy" />
        </li>
      ))}
    </ul>
  ) : null;
}
