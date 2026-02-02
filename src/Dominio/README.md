# capa de dominio

esta es la capa más interna y pura del proyecto. contiene la lógica de negocio central y las reglas que no dependen de ninguna tecnología externa (ni base de datos, ni frameworks, ni api).

## contenido
* **models/**: contiene las clases o interfaces que definen nuestros objetos de negocio (usuario, ejercicio, plan, sesión). definen "qué" es un dato.
* **interfaces/**: contiene los "contratos" (interfaces de repositorio). definen qué operaciones se pueden hacer (guardar, buscar, borrar) pero no "cómo" se hacen.
* **value-objects/**: contiene validaciones específicas para datos primitivos (ej: dni, email) para asegurar la integridad del dato.

## reglas
1.  aquí no puede haber código de librerías externas (express, mongoose, etc.).
2.  cualquier cambio aquí afecta a toda la aplicación.