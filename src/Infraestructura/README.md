# capa de infraestructura

esta capa es la responsable de conectar la lógica de negocio (dominio y aplicación) con el mundo exterior. contiene todas las implementaciones técnicas, frameworks y herramientas concretas. si decidiéramos cambiar express por otro framework o mongodb por sql, esta sería la única carpeta que debería modificarse.

## contenido de las carpetas

### config/
contiene la configuración global del entorno. aquí se cargan y exportan las variables de entorno (como credenciales de base de datos o puertos) para que el resto de la aplicación las use de forma segura y centralizada.

### controllers/
actúan como los adaptadores de entrada para las peticiones http. su función es:
1. recibir la petición (req) y la respuesta (res) de express.
2. extraer y validar los datos de entrada.
3. invocar al servicio correspondiente de la capa de aplicación.
4. devolver la respuesta en formato json con el código de estado http adecuado (200, 201, 400, etc.).

### database/
contiene la lógica necesaria para establecer la conexión física con la base de datos (en este caso, mongodb). gestiona la apertura de conexiones y los eventos de error o desconexión.

### models/
define los esquemas específicos de la base de datos (mongoose schemas). estos modelos representan cómo se guardan los datos físicamente en mongodb (incluyendo tipos de datos de mongo, índices y validaciones de base de datos).
*nota: no confundir con los modelos del dominio. estos son exclusivos para la persistencia.*

### repository/
contiene la implementación concreta de las interfaces definidas en la capa de dominio. aquí es donde se traduce el lenguaje del dominio ("guardar usuario") al lenguaje de la base de datos ("usuarioModel.create()"). implementa el patrón repositorio para desacoplar el dominio de la base de datos.

### routes/
define los puntos de entrada (endpoints) de la api. vincula las urls específicas (ej: `POST /api/usuarios`) con sus respectivos controladores. también aplica middlewares de validación o seguridad si es necesario.

### schemas/
contiene los esquemas de validación de datos de entrada utilizando la librería zod. estos esquemas aseguran que los datos que llegan desde el cliente (frontend) tengan el formato, tipo y restricciones correctas antes de ser procesados por el controlador.

### tests/
contiene las pruebas de integración y end-to-end (e2e). estos tests verifican que todas las piezas de la infraestructura (rutas, controladores, servicios, repositorios y base de datos) funcionen correctamente en conjunto, simulando peticiones reales a la api.

## reglas
1.  es la única capa que puede depender de frameworks (express, mongoose, zod).
2.  si cambiamos de base de datos (de mongo a sql), solo tendríamos que tocar esta carpeta.