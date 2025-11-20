import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});

