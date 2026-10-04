import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createFlowersMiddleware } from "./server/flowers-api.js";
import { createGardenStatsMiddleware } from "./server/garden-stats-api.js";
import { createSnakeScoreMiddleware } from "./server/snake-score-api.js";
import { createGeminiFlowerMiddleware } from "./server/gemini-flower.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "gemini-flower-api",
        configureServer(server) {
          server.middlewares.use(
            "/api/generate-flower",
            createGeminiFlowerMiddleware(env),
          );
          server.middlewares.use("/api/flowers", createFlowersMiddleware(env));
          server.middlewares.use(
            "/api/garden-stats",
            createGardenStatsMiddleware(env),
          );
          server.middlewares.use(
            "/api/snake-score",
            createSnakeScoreMiddleware(env),
          );
        },
      },
    ],
    base: "/",
    assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.gif"],
    build: {
      outDir: "dist",
    },
  };
});
