# Cosas a mejorar y siguientes pasos

## 1) Interfaces y contratos
- Definir `IUserRepository` con métodos de `update` y `delete` para simetría con productos.
- Extraer interfaces para servicios/casos de uso si se planea inyectar middlewares cross-cutting (logging, métricas).

## 2) Inversión de control / DI
- Introducir un contenedor sencillo o fábrica en el composition root para no instanciar repos directamente en controladores.
- Permitir configuración por entorno (BD real, mocks en tests end-to-end).

## 3) Infraestructura de testing
- Agregar tests de integración HTTP con supertest apuntando a un servidor Express con repos en memoria.
- Cubrir flujos de error en controladores (códigos 400/404/500) para garantizar contratos de API.
- Añadir pruebas de repositorios contra SQLite en una BD temporal para validar SQL.

## 4) Observabilidad y errores
- Centralizar manejo de errores HTTP con un middleware de error en Express.
- Agregar logging estructurado (nivel info/error) y correlación de peticiones.
- Incorporar validaciones adicionales (limites de tamaño, tipos) antes de tocar la BD.

## 5) Seguridad y configuración
- Mover strings sensibles (puerto, ruta DB) a variables de entorno y usar un archivo de config tipado.
- Revisar encabezados HTTP seguros (helmet), rate limiting y validación de CORS.

## 6) Modelado de dominio
- Añadir Value Objects para precio/importe que controlen moneda y rango.
- Considerar una entidad Producto con métodos de dominio si crecen las reglas (p. ej. descuentos, stock).
- Normalizar nombres (lowercase/trim) en VOs específicos.

## 7) Migraciones y datos
- Incorporar herramienta de migraciones (knex, drizzle) para versionar cambios de esquema.
- Semillas (seed) de datos para ambientes de demo/test.

## 8) API y DX
- Documentar la API con OpenAPI/Swagger y ejemplos de requests/responses.
- Añadir validación de esquemas en respuestas (ej. zod + zod-to-openapi) para contratos completos.
- Escribir README de ejecución/local/test con pasos claros.

## 9) Performance y escalabilidad
- Usar pooling/conexiones parametrizables si se cambia de SQLite a un motor server (Postgres).
- Añadir caching simple en `getAll` si hay alto tráfico de lectura (con invalidación al crear/actualizar/borrar).

## 10) Dev Experience
- Añadir lint/format (ESLint + Prettier) con reglas básicas y hooks de pre-commit.
- Configurar CI para correr `npm test` y `npm run build` en cada push/PR.
