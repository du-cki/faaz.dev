// @ts-check
import { defineConfig, memoryCache } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: vercel({
    isr: {
      expiration: 60 * 60,
    },
    webAnalytics: {
      enabled: true,
    },
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
