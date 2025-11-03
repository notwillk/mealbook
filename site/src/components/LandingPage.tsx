import { getMenuListingUrl, getRecipeListingUrl } from "../utils/urls";

export default function LandingPage() {
  return (
    <main className="app-shell">
      <h1>Mealbook</h1>
      <ul>
        <li>
          <a href={getRecipeListingUrl()}>Recipes</a>
        </li>
        <li>
          <a href={getMenuListingUrl()}>Menus</a>
        </li>
      </ul>
    </main>
  );
}
