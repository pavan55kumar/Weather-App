import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "icon-192.png",
        "icon-512.png",
      ],

     manifest: {
  id: "/",

  name: "AeroSky Premium Weather Dashboard",

  short_name: "AeroSky",

  description:
    "Premium Weather Forecast Dashboard with AI Insights, Globe Visualization and Advanced Analytics.",

  theme_color: "#0f172a",

  background_color: "#020617",

  start_url: "/",

  scope: "/",

  display: "standalone",

  orientation: "portrait",

  icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});