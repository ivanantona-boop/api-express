// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Ignorar carpetas (para que no revise dist ni node_modules)
  { ignores: ["dist", "node_modules", "coverage"] },

  // 2. Configuración para todos los archivos JS/TS
  { 
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { 
      globals: globals.node, // Le decimos que estamos en Node.js (para process, etc.)
    }
  },

  // 3. Reglas recomendadas básicas
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // 4. Integración con Prettier
  // Esto desactiva las reglas de ESLint que chocan con Prettier
  eslintConfigPrettier,

  // 5. Reglas personalizadas
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Si Prettier encuentra un error de estilo, ESLint lo marca como ERROR (rojo)
      "prettier/prettier": "error",

      // Desactivamos reglas molestas de TS que ya tenías apagadas
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Avisar si usas 'any', pero no fallar
      
      // Permitir variables no usadas si empiezan por guion bajo (ej: _req)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
    },
  },
];