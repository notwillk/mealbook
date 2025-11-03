import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const base =
  process.env.ASTRO_BASE_PATH ??
  (process.env.CI === "true" ? "/mealbook/" : "/");

export default defineConfig({
  integrations: [react()],
  server: {
    host: true,
    port: 4321,
  },
  base,
});
