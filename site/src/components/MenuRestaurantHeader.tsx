import type { Restaurant } from "../types/generated/menu";
import MenuImages from "./MenuImages";

type Props = {
  restaurant: Restaurant;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export default function MenuRestaurantHeader({
  restaurant,
}: Props) {
  const cuisines = toArray(restaurant.servesCuisine);

  return (
    <header className="menu__restaurant">
      <h1>{restaurant.name}</h1>
      {restaurant.description && <p>{restaurant.description}</p>}
      {cuisines.length > 0 && (
        <dl>
          <dt>Serves cuisine</dt>
          <dd>{cuisines.join(", ")}</dd>
        </dl>
      )}
      <MenuImages image={restaurant.image} />
    </header>
  );
}
