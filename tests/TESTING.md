# Test Setup: Vitest + Playwright

This repo currently ships without a test runner. Below is a minimal, opinionated setup for unit/integration tests (Vitest) and end‑to‑end tests (Playwright), aligned with our structure and dev server.

## Vitest (unit/integration)
- Install:
  - `npm i -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom`
- Scripts (add to `package.json`):
  - `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:ui": "vitest --ui"`
- Config (`vitest.config.ts` at repo root):
  ```ts
  import { defineConfig } from "vitest/config";

  export default defineConfig({
    test: {
      include: [
        "server/**/*.test.ts",
        "shared/**/*.test.ts",
        "client/src/**/*.{test,spec}.{ts,tsx}"
      ],
      environment: "node",
      environmentMatchGlobs: [
        ["client/**", "jsdom"],
        ["server/**", "node"],
        ["shared/**", "node"],
      ],
      setupFiles: ["client/src/test/setup.ts"],
      coverage: { provider: "v8", reportsDirectory: "./coverage" },
    },
  });
  ```
- JSDOM setup (`client/src/test/setup.ts`):
  ```ts
  import "@testing-library/jest-dom";
  ```
- Example tests:
  - Server: `server/routes.test.ts`
  - Client: `client/src/components/Button.test.tsx`

## Playwright (e2e)
- Install:
  - `npm i -D @playwright/test`
  - `npx playwright install` (downloads browsers)
- Scripts (add to `package.json`):
  - `"e2e": "playwright test"`, `"e2e:headed": "playwright test --headed"`, `"e2e:report": "playwright show-report"`
- Config (`playwright.config.ts` at repo root):
  ```ts
  import { defineConfig, devices } from "@playwright/test";

  export default defineConfig({
    timeout: 30_000,
    retries: process.env.CI ? 2 : 0,
    use: { baseURL: "http://localhost:8080" },
    webServer: {
      command: process.env.CI ? "npm start" : "npm run dev",
      url: "http://localhost:8080",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    projects: [
      { name: "chromium", use: { ...devices["Desktop Chrome"] } },
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
      { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    reporter: process.env.CI ? "github" : [["list"], ["html", { open: "never" }]],
  });
  ```
- Example spec (`tests/e2e/health.spec.ts`):
  ```ts
  import { test, expect } from "@playwright/test";

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
  });
  ```

## CI & Tips
- In CI: `npm ci && npm run build && npm test && npm run e2e`.
- Prefer fast unit tests for logic in `shared/` and `server/`; reserve Playwright for critical flows.
- Keep fixtures small; mock external APIs (OpenAI/Twilio) and avoid real secrets.
