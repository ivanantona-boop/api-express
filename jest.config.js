// 1. Importamos una utilidad de 'ts-jest' que ya trae la configuración recomendada
// para que Jest pueda entender y procesar archivos de TypeScript.
const { createDefaultPreset } = require("ts-jest");

// 2. Extraemos específicamente la configuración de "transformación".
// La transformación es el proceso de traducir tu código TypeScript (.ts) 
// a JavaScript (.js) para que Node.js pueda ejecutarlo durante los tests.
const tsJestTransformCfg = createDefaultPreset().transform;

/** * Esta línea (JSDoc) sirve para que tu editor (como VS Code) te ayude 
 * sugiriendo opciones mientras escribes la configuración.
 * @type {import("jest").Config} 
 **/
module.exports = {
  // 3. Indicamos que el entorno de ejecución es Node.js.
  // Esto es vital para APIs, ya que no necesitamos simular un navegador (DOM).
  testEnvironment: "node",

  // 4. Aplicamos la configuración de transformación que extrajimos arriba.
  // Básicamente le dice a Jest: "Si ves un archivo .ts, usa ts-jest para leerlo".
  transform: {
    ...tsJestTransformCfg,
  },

  // 5. El "Buscador" de tests. Aquí definimos el patrón de búsqueda:
  // - **/tests/** -> Busca en cualquier carpeta llamada 'tests'.
  // - **/*.test.ts -> Busca archivos que terminen específicamente en '.test.ts'.
  testMatch: ["**/tests/**/*.test.ts"],

  // 6. Modo "Detallado". Al estar en true, la terminal te mostrará 
  // el nombre de cada test individual y si pasó o falló, en lugar de un resumen breve.
  verbose: true,

  // 7. Configuración de Cobertura (Coverage).
  // Define qué archivos debe analizar Jest para decirte cuánto código has testeado.
  collectCoverageFrom: [
    "src/**/*.ts",            // Analiza todos los archivos .ts dentro de 'src'.
    "!src/interfaces/**",     // EXCLUYE interfaces (porque no tienen lógica ejecutable).
    "!src/models/**",         // EXCLUYE modelos (son solo definiciones de datos).
    "!src/index.ts",          // EXCLUYE el arranque del servidor real.
    "!src/server.ts"          // EXCLUYE la configuración de escucha del puerto.
  ],
};

// Opcional: Para que el test falle si no llegas a un mínimo de cobertura (ej. 80%)
  /*
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  */
