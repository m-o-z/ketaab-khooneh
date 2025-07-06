// eslint.config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";
import pluginSecurity from "eslint-plugin-security";
import pluginPromise from "eslint-plugin-promise";
import pluginPrettier from "eslint-plugin-prettier";
import pluginNext from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier/flat";
import globals from "globals";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = {
  ignores: ["node_modules/", ".next/", "out/", "public/", "coverage/", "dist/"],
};

const mainConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
      ecmaFeatures: {
        jsx: true,
      },
      tsconfigRootDir: __dirname,
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    prettier: pluginPrettier,
    "@typescript-eslint": tseslint.plugin,
    react: pluginReact,
    "react-hooks": pluginReactHooks,
    "jsx-a11y": pluginJsxA11y,
    import: pluginImport,
    security: pluginSecurity,
    promise: pluginPromise,
    "@next/next": pluginNext,
  },
  rules: {
    // Prettier
    "prettier/prettier": "error",

    // General JS/TS
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true, allowBoolean: true },
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",

    // React
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-sort-props": [
      "warn",
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    "react/jsx-boolean-value": ["error", "never"],

    // Import
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/no-unresolved": "error",
    "import/no-duplicates": "error",
    "import/no-extraneous-dependencies": "error",

    // Performance
    "no-lonely-if": "warn",
    "no-else-return": ["warn", { allowElseIf: false }],
    "prefer-const": "warn",
    "no-template-curly-in-string": "warn",
    "array-callback-return": "warn",
    "no-unreachable": "warn",
    "no-unsafe-finally": "warn",

    // Naming
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "parameter",
        format: ["camelCase", "PascalCase", "snake_case"],
        leadingUnderscore: "allow",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["PascalCase", "UPPER_CASE"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: false,
        },
      },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        custom: {
          regex: "^T[A-Z]",
          match: false,
        },
      },
    ],

    // Minimal Next.js rules (manual)
    "@next/next/no-img-element": "warn",
    "@next/next/no-sync-scripts": "warn",
    "@next/next/no-title-in-document-head": "warn",
    "@next/next/no-head-element": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};

export default tseslint.config(
  baseConfig,
  mainConfig,

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
);
