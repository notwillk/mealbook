import type { Menu, Recipe } from "../types/schema";

type AppProps = {
  recipes: Record<string, Recipe>;
  menus: Record<string, Menu>;
};

export function App({ recipes, menus }: AppProps) {
  return (
    <main className="app-shell">
      <h1>Mealbook</h1>
      <ul>
        <li>
          <a href="/recipes">Recipes</a>
        </li>
        <li>
          <a href="/menus">Menus</a>
        </li>
      </ul>
      <h2>Recipes</h2>
      <pre>{JSON.stringify(recipes, null, 2)}</pre>
      <h2>Menus</h2>
      <pre>{JSON.stringify(menus, null, 2)}</pre>
    </main>
  );
}
