# configuración y arranque del sistema

en la raíz del código fuente (`src/`) se encuentran los archivos encargados de configurar el servidor, establecer las conexiones y realizar la inyección de dependencias. estos archivos son el corazón operativo de la api.

## descripción de archivos

### app.ts (configuración de la aplicación)
este archivo es responsable de definir y configurar la instancia de la aplicación express. no inicia el servidor, solo lo prepara. sus funciones principales son:
1.  **configuración de middlewares**: inicializa herramientas de seguridad (helmet, cors), parseo de cuerpos json y documentación (swagger).
2.  **definición de rutas**: importa y monta las rutas definidas en la capa de infraestructura sobre la ruta base (ej: `/api`).
3.  **exportación**: exporta la variable `app` sin escuchar en ningún puerto, lo cual es fundamental para poder realizar tests de integración (supertest) sin bloquear puertos de red reales.

### server.ts (punto de entrada)
es el punto de entrada principal (entry point) de la aplicación. es el archivo que ejecuta node.js para arrancar el sistema. sus responsabilidades son:
1.  **conexión a base de datos**: invoca la conexión a mongodb antes de aceptar peticiones.
2.  **inicio del servidor**: importa la `app` configurada y llama al método `.listen()` para empezar a escuchar peticiones en el puerto especificado (por defecto 3000).
3.  **gestión de logs**: notifica por consola que el servidor está operativo.

### container.ts (inyección de dependencias)
este archivo actúa como la "raíz de composición" (composition root) de la arquitectura hexagonal. es el único lugar de la aplicación donde se utiliza la palabra clave `new` para instanciar las clases principales. su flujo es:
1.  **instanciación de repositorios**: decide qué implementación de base de datos usar (mongo real o mocks para testing) basándose en las variables de entorno.
2.  **inyección en servicios**: crea las instancias de los servicios (capa de aplicación) inyectándoles los repositorios y la caché necesarios.
3.  **inyección en controladores**: crea las instancias de los controladores (capa de infraestructura) inyectándoles los servicios ya configurados.
4.  **exportación**: exporta los controladores ya construidos y listos para ser usados en las rutas, garantizando que todas las dependencias están resueltas antes de recibir tráfico.