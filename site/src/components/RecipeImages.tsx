import type { Recipe } from "../types/schema";

type Props = {
  recipe: Recipe;
};

export default function RecipeImages({ recipe: { image } }: Props) {
  const images = image ? new Set(Array.isArray(image) ? image : [image]) : null;

  return images && images.size > 0 ? (
    <ul className="recipe__images">
      {images.entries().map(([src]) => (
        <li key={src}>
          <img src={src} loading="lazy" />
        </li>
      ))}
    </ul>
  ) : null;
}
