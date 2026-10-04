import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3101" },
  webServer: {
    command: "npm run build && npm start -- -p 3101",
    url: "http://localhost:3101",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
