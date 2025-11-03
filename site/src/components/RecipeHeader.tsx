import type { Recipe } from "../types/schema";
import RecipeDetailItem from "./RecipeDetailItem";

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({
  recipe: { name, alternateName, author, description, recipeYield },
}: Props) {
  const authorName = typeof author === "object" ? author.name : author;
  const alternateNames = alternateName ? alternateName : [];
  return (
    <header>
      <div>
        <h1>{name}</h1>
        {alternateNames.length > 0 && (
          <p>
            <strong>Also known as:</strong> {alternateNames.join(", ")}
          </p>
        )}
        {authorName && (
          <p>
            <strong>By:</strong> <span>{authorName}</span>
          </p>
        )}
      </div>

      {description && <p>{description}</p>}
      {recipeYield && (
        <RecipeDetailItem title="Yield">
          {recipeYield.toString()}
        </RecipeDetailItem>
      )}
    </header>
  );
}
