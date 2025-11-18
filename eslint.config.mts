// eslint.config.mjs
import stylistic from '@stylistic/eslint-plugin'
import prettierConfig from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  // ───────────────────────────────────────────────
  // 1. ESLint config files should NOT be type-checked
  // ───────────────────────────────────────────────
  {
    files: ["eslint.config.*", "*.config.*", "*.config.*.cjs", "*.config.*.mjs"],
    languageOptions: {
      parserOptions: {
        project: null, // disable type-aware linting for config
      },
    },
  },

  // ───────────────────────────────────────────────
  // 2. Base JS/TS rules for all source files
  // ───────────────────────────────────────────────
  {
    files: ["src/**/*.{ts,cts,mts,js,cjs,mjs}"],
    ignores: ["dist/**", "node_modules/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Node environment
        ...globals.jest, // Jest environment
        ...globals.browser, // optional if you have browser code
      },
      parserOptions: {
        project: "./tsconfig.json", // matches your tsconfig
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      '@stylistic': stylistic,
      prettier: prettierPlugin,
    },

    rules: {
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "stylistic/newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
      "prettier/prettier": "error",
    },
  },

  // ───────────────────────────────────────────────
  // 3. TypeScript ESLint recommended rules
  // ───────────────────────────────────────────────
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // type-aware rules

  // ───────────────────────────────────────────────
  // 4. Prettier (must be last)
  // ───────────────────────────────────────────────
  prettierConfig,
]);
