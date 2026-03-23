// @ts-check
import { defineConfig, memoryCache } from "astro/config";

import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  experimental: {
    cache: {
      provider: memoryCache(),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), react()],
});
