# capa de aplicación

esta capa actúa como intermediaria u orquestadora. su responsabilidad es ejecutar acciones concretas que pide el usuario, conectando el dominio con la infraestructura.

## contenido
* **use-cases/**: cada archivo representa una acción única del sistema (ej: `crear-usuario.use-case.ts`). contiene la lógica paso a paso: validar datos -> llamar al repositorio -> devolver respuesta.
* **services/**: (patrón fachada) agrupan varios casos de uso para facilitar su inyección en los controladores. actúan como punto de entrada simplificado.

## reglas
1.  esta capa conoce el dominio (importa modelos).
2.  esta capa define "qué" debe pasar cuando llega una petición, pero no sabe si viene por http o consola.