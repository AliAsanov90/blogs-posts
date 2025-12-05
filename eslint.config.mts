// eslint.config.mjs
import stylistic from '@stylistic/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // ───────────────────────────────────────────────
  // 1. ESLint config files should NOT be type-checked
  // ───────────────────────────────────────────────
  {
    files: ['eslint.config.*', '*.config.*', '*.config.*.cjs', '*.config.*.mjs'],
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
    files: ['src/**/*.{ts,cts,mts,js,cjs,mjs}', '__tests__/**/*.{ts}'],
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // Node environment
        ...globals.jest, // Jest environment
        ...globals.browser, // optional if you have browser code
      },
      parserOptions: {
        project: './tsconfig.json', // matches your tsconfig
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      '@stylistic': stylistic,
      prettier: prettierPlugin,
    },

    rules: {
      'no-console': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': 'warn',
      // '@typescript-eslint/restrict-template-expressions': ['error', {
      //   allow: [{ 'name': 'error', 'from': 'lib' }]
      // }],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      'prettier/prettier': 'error',
    },
  },

  // ───────────────────────────────────────────────
  // 3. TypeScript ESLint recommended rules
  // ───────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,cts,mts}', '__tests__/**/*.{ts}'],
    ...tseslint.configs.recommended[0],
  },
  {
    files: ['src/**/*.{ts,cts,mts}', '__tests__/**/*.{ts}'],
    ...tseslint.configs.recommendedTypeChecked[0],
  },

  // ───────────────────────────────────────────────
  // 4. Prettier (must be last)
  // ───────────────────────────────────────────────
  prettierConfig,
])
