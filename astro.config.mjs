// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";
import { cacheVercel } from "@astrojs/vercel/cache";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  cache: {
    provider: cacheVercel(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), react()],
});
