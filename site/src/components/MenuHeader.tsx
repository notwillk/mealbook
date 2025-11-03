import type { Menu as SchemaMenu } from "../types/generated/menu";

type Props = {
  menu: SchemaMenu;
  headingLevel: number;
};

function clampHeading(level: number): number {
  return Math.min(6, Math.max(1, level));
}

export default function MenuHeader({
  menu: { name, description, inLanguage },
  headingLevel,
}: Props) {
  const Heading = `h${clampHeading(headingLevel)}` as keyof JSX.IntrinsicElements;

  return (
    <header className="menu__header">
      {name && <Heading>{name}</Heading>}
      {description && <p>{description}</p>}
      {inLanguage && (
        <dl>
          <dt>Language</dt>
          <dd>{inLanguage}</dd>
        </dl>
      )}
    </header>
  );
}
