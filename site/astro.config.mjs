import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const base =
  process.env.ASTRO_BASE_PATH ??
  (process.env.CI === "true" ? "/mealbook/" : "/");

export default defineConfig({
  integrations: [react(), tailwind()],
  server: {
    host: true,
    port: 4321,
  },
  base,
});
