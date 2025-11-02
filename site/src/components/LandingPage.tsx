import type { Menu, Recipe } from "../types/schema";

export default function LandingPage() {
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
    </main>
  );
}
