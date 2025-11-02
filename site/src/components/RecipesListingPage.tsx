type Props = { recipes: Record<string, unknown> };

export default function RecipesListingPage({ recipes }: Props) {
  return <pre>{JSON.stringify(recipes, null, 2)}</pre>;
}
