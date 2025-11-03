import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const isProd = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  integrations: [react()],
  server: {
    host: true,
    port: 4321,
  },
  base: isProd ? "/mealbook/" : "/",
});
