import type { Recipe } from "../types/schema";
import { Clock, Users, Star, Heart, Calendar, Globe, Tag } from "lucide-react";
import RecipeLinks from "./RecipeLinks";

type Props = {
  recipe: Recipe;
  url: string | null;
};

type Ingredient = Recipe["recipeIngredient"][number];
type HowToStep = Recipe["recipeInstructions"][number];

function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]}h` : "";
  const minutes = match[2] ? `${match[2]}m` : "";
  const seconds = match[3] ? `${match[3]}s` : "";

  return [hours, minutes, seconds].filter(Boolean).join(" ");
}

function renderIngredient(ingredient: string | Ingredient): string {
  if (typeof ingredient === "string") {
    return ingredient;
  }

  const parts = [ingredient.name];
  if (ingredient.value) {
    parts.unshift(
      `${ingredient.value}${ingredient.unitCode ? ` ${ingredient.unitCode}` : ""}`
    );
  }
  return parts.join(" ");
}

function renderInstruction(
  instruction: string | HowToStep,
  index: number
): { text: string; name?: string } {
  if (typeof instruction === "string") {
    return { text: instruction };
  }
  return { text: instruction.text, name: instruction.name };
}

export default function Recipe({ recipe, url }: Props) {
  const images = Array.isArray(recipe.image)
    ? recipe.image
    : recipe.image
      ? [recipe.image]
      : [];
  const keywords = Array.isArray(recipe.keywords)
    ? recipe.keywords
    : recipe.keywords
      ? [recipe.keywords]
      : [];
  const instructions = Array.isArray(recipe.recipeInstructions)
    ? recipe.recipeInstructions
    : [recipe.recipeInstructions];

  return (
    <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
      {/* Header Image */}
      {images.length > 0 && (
        <div className="relative h-64 md:h-96 bg-muted">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Title and Alternate Names */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            {recipe.name}
          </h1>
          {recipe.alternateName && recipe.alternateName.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Also known as: {recipe.alternateName.join(", ")}
            </p>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
          {recipe.datePublished && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(recipe.datePublished).toLocaleDateString()}</span>
            </div>
          )}
          {recipe.inLanguage && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>{recipe.inLanguage}</span>
            </div>
          )}
          {recipe.aggregateRating && (
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {recipe.aggregateRating.ratingValue}
              </span>
              {recipe.aggregateRating.ratingCount && (
                <span>({recipe.aggregateRating.ratingCount} ratings)</span>
              )}
            </div>
          )}
          {recipe.interactionStatistic && (
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span>
                {recipe.interactionStatistic.userInteractionCount} interactions
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">
          {recipe.description}
        </p>

        {/* Author */}
        {recipe.author && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              By:{" "}
              {typeof recipe.author === "string" ? (
                recipe.author
              ) : recipe.author.url ? (
                <a
                  href={recipe.author.url}
                  className="text-primary hover:underline"
                >
                  {recipe.author.name}
                </a>
              ) : (
                recipe.author.name
              )}
            </p>
          </div>
        )}

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.recipeCuisine && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {recipe.recipeCuisine}
            </span>
          )}
          {recipe.recipeCategory && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
              {recipe.recipeCategory}
            </span>
          )}
          {recipe.suitableForDiet && (
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
              {recipe.suitableForDiet.replace(/([A-Z])/g, " $1").trim()}
            </span>
          )}
        </div>

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {keywords.map((keyword, index) => (
                <span key={index} className="text-sm text-muted-foreground">
                  {keyword}
                  {index < keywords.length - 1 && ","}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Time and Yield Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted rounded-lg">
          {recipe.prepTime && (
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Prep Time</p>
              <p className="font-medium">{parseDuration(recipe.prepTime)}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Cook Time</p>
              <p className="font-medium">{parseDuration(recipe.cookTime)}</p>
            </div>
          )}
          {recipe.totalTime && (
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Time</p>
              <p className="font-medium">{parseDuration(recipe.totalTime)}</p>
            </div>
          )}
          {recipe.recipeYield && (
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Yield</p>
              <p className="font-medium">{recipe.recipeYield}</p>
            </div>
          )}
        </div>

        {/* Nutrition Information */}
        {recipe.nutrition && (
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="text-xl font-bold mb-3">Nutrition Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recipe.nutrition.calories && (
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-medium">{recipe.nutrition.calories}</p>
                </div>
              )}
              {recipe.nutrition.proteinContent && (
                <div>
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-medium">
                    {recipe.nutrition.proteinContent}
                  </p>
                </div>
              )}
              {recipe.nutrition.carbohydrateContent && (
                <div>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-medium">
                    {recipe.nutrition.carbohydrateContent}
                  </p>
                </div>
              )}
              {recipe.nutrition.fatContent && (
                <div>
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-medium">{recipe.nutrition.fatContent}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.recipeIngredient.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="leading-relaxed">
                  {renderIngredient(ingredient)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {instructions.map((instruction, index) => {
              const { text, name } = renderInstruction(instruction, index);
              return (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    {name && <p className="font-medium mb-1">{name}</p>}
                    <p className="leading-relaxed text-pretty">{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Additional Images */}
        {images.length > 1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">More Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${recipe.name} - photo ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <RecipeLinks recipe={recipe} url={url} />
      </div>
    </div>
  );
}
