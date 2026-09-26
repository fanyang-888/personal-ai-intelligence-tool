import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    // Explicit roots: the repo's .claude/worktrees/ holds full checkouts whose tests must not run here
    include: ["lib/**/*.test.ts", "components/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
  },
});
