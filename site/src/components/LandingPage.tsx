import { ChefHat } from "lucide-react";
import { getMenuListingUrl, getRecipeListingUrl } from "../utils/urls";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <ChefHat
              className="w-48 h-48 text-primary relative"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance">
            Discover Your Next
            <span className="block text-primary">Favorite Meal</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore curated menus and delicious recipes crafted for every
            occasion
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href={getRecipeListingUrl()}
            className="group relative px-8 py-4 bg-green-200 text-accent-foreground rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl w-full sm:w-auto"
          >
            <span className="relative z-10 text-green-800">View Recipes</span>
            <div className="absolute inset-0 bg-green-500/80 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href={getMenuListingUrl()}
            className="group relative px-8 py-4 bg-green-200 text-accent-foreground rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl w-full sm:w-auto"
          >
            <span className="relative z-10 text-green-800">Browse Menus</span>
            <div className="absolute inset-0 bg-primary/80 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </main>
  );
}
