import { 
  OpenAPIRegistry, 
  OpenApiGeneratorV3, 
  extendZodWithOpenApi 
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Configuración inicial de Zod + OpenAPI
extendZodWithOpenApi(z);
const registry = new OpenAPIRegistry();

// ==========================================
// 1. DEFINICIÓN DE ESQUEMAS (MODELOS DE DATOS)
// ==========================================

// --- Esquema PRODUCTO (El que ya tenías) ---
const ProductoSchema = registry.register('Producto', z.object({
  id: z.number().openapi({ example: 1 }), // SQLite usa números, Mongo strings. Ojo aquí si migras productos.
  nombre: z.string().openapi({ example: 'Zapatillas Running' }),
  precio: z.number().openapi({ example: 59.99 }),
}));

// --- Esquema USUARIO (El nuevo para Mongo) ---
// Definimos dos: uno para lo que ENTRA (Input) y otro para lo que SALE (Response)
// para no devolver la contraseña en la documentación.

const UsuarioInputSchema = registry.register('UsuarioInput', z.object({
  nombre: z.string().openapi({ example: 'Juan' }),
  apellidos: z.string().openapi({ example: 'Pérez' }),
  DNI: z.string().openapi({ example: '12345678Z' }),
  email: z.string().email().openapi({ example: 'juan@email.com' }),
  contraseña: z.string().openapi({ example: 'passwordSeguro123' }),
}));

const UsuarioResponseSchema = registry.register('UsuarioResponse', z.object({
  id: z.string().openapi({ example: '65a9f2b1c83d9a001e5a1b2c' }), // ID de Mongo es string
  nombre: z.string().openapi({ example: 'Juan' }),
  apellidos: z.string().openapi({ example: 'Pérez' }),
  DNI: z.string().openapi({ example: '12345678Z' }),
  email: z.string().email().openapi({ example: 'juan@email.com' }),
  // Nota: No incluimos la contraseña en la respuesta por seguridad
}));

// ==========================================
// 2. DEFINICIÓN DE RUTAS (ENDPOINTS)
// ==========================================

// --- Rutas de PRODUCTOS ---
registry.registerPath({
  method: 'get',
  path: '/api/productos',
  description: 'Obtiene el listado de todos los productos',
  summary: 'Listar Productos',
  tags: ['Productos'],
  responses: {
    200: {
      description: 'Lista de productos',
      content: {
        'application/json': { schema: z.array(ProductoSchema) },
      },
    },
  },
});

// --- Rutas de USUARIOS (NUEVO) ---

// 1. GET /api/usuarios (Obtener todos)
registry.registerPath({
  method: 'get',
  path: '/api/usuarios',
  description: 'Obtiene todos los usuarios registrados en MongoDB',
  summary: 'Listar Usuarios',
  tags: ['Usuarios'],
  responses: {
    200: {
      description: 'Lista de usuarios recuperada',
      content: {
        'application/json': { schema: z.array(UsuarioResponseSchema) },
      },
    },
  },
});

// 2. GET /api/usuarios/{dni} (Buscar por DNI)
registry.registerPath({
  method: 'get',
  path: '/api/usuarios/{dni}',
  description: 'Busca un usuario específico por su DNI',
  summary: 'Obtener Usuario por DNI',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      dni: z.string().openapi({ example: '12345678Z' }),
    }),
  },
  responses: {
    200: {
      description: 'Usuario encontrado',
      content: { 'application/json': { schema: UsuarioResponseSchema } },
    },
    404: { description: 'Usuario no encontrado' },
  },
});

// 3. POST /api/usuarios (Crear Usuario)
registry.registerPath({
  method: 'post',
  path: '/api/usuarios',
  description: 'Registra un nuevo usuario en la base de datos',
  summary: 'Crear Usuario',
  tags: ['Usuarios'],
  request: {
    body: {
      content: {
        'application/json': { schema: UsuarioInputSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuario creado exitosamente',
      content: { 'application/json': { schema: UsuarioResponseSchema } },
    },
    400: { description: 'Datos inválidos (Zod Validation Error)' },
    409: { description: 'El usuario ya existe' },
  },
});

// 4. PUT /api/usuarios/{dni} (Actualizar)
registry.registerPath({
  method: 'put',
  path: '/api/usuarios/{dni}',
  summary: 'Actualizar Usuario',
  tags: ['Usuarios'],
  request: {
    params: z.object({ dni: z.string() }),
    body: {
      content: {
        // .partial() hace que todos los campos sean opcionales para actualizar
        'application/json': { schema: UsuarioInputSchema.partial() },
      },
    },
  },
  responses: {
    200: { description: 'Usuario actualizado', content: { 'application/json': { schema: UsuarioResponseSchema } } },
    404: { description: 'Usuario no encontrado' },
  },
});

// 5. DELETE /api/usuarios/{dni} (Borrar)
registry.registerPath({
  method: 'delete',
  path: '/api/usuarios/{dni}',
  summary: 'Eliminar Usuario',
  tags: ['Usuarios'],
  request: {
    params: z.object({ dni: z.string() }),
  },
  responses: {
    200: { description: 'Usuario eliminado correctamente' },
    404: { description: 'Usuario no encontrado' },
  },
});

// ==========================================
// 3. GENERACIÓN DEL DOCUMENTO
// ==========================================

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'API Tienda - Hexagonal & Mongo',
    version: '2.0.0',
    description: 'Documentación actualizada con soporte para Usuarios (MongoDB) y Productos',
  },
  servers: [
    { url: '/' }, // Usamos raíz para evitar conflictos de rutas dobles
  ],
});