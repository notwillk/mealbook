import type { MenuItem } from "../types/generated/menu";
import MenuItemDetails from "./MenuItem";

type Props = {
  items?: MenuItem | MenuItem[];
  headingLevel: number;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function clampHeading(level: number): number {
  return Math.min(6, Math.max(1, level));
}

export default function MenuItems({ items, headingLevel }: Props) {
  const list = toArray(items);

  if (list.length === 0) {
    return null;
  }

  const Heading = `h${clampHeading(headingLevel)}` as keyof JSX.IntrinsicElements;

  const itemHeadingLevel = clampHeading(headingLevel + 1);

  return (
    <section className="menu__items">
      <Heading>Items</Heading>
      <ul>
        {list.map((item, index) => (
          <MenuItemDetails
            item={item}
            headingLevel={itemHeadingLevel}
            key={`${item.name}-${index}`}
          />
        ))}
      </ul>
    </section>
  );
}
