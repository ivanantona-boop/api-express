import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // 1️⃣ Configuración base de JS recomendada
  js.configs.recommended,

  // 2️⃣ Configuración para TypeScript
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: "readonly", // Node.js
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Apagamos las reglas de JS que interfieren con TS
      "no-unused-vars": "off",
      "no-undef": "off",

      // Regla correcta para variables no usadas en TS
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 3️⃣ Integración con Prettier
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "all",
          printWidth: 100,
        },
      ],

      // 4️⃣ Otras reglas recomendadas de TS
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
    },
  },
];
