import { 
  OpenAPIRegistry, 
  OpenApiGeneratorV3, 
  extendZodWithOpenApi // <--- 1. Importamos esto
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 2. ¡LÍNEA MÁGICA! 
// Esto enseña a Zod a usar el método .openapi(). Sin esto, da error.
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// --- DEFINICIÓN DE ESQUEMAS ---

const ProductoSchema = registry.register('Producto', z.object({
  id: z.number().openapi({ example: 1 }),
  nombre: z.string().openapi({ example: 'Zapatillas Running' }),
  precio: z.number().openapi({ example: 59.99 }),
}));

// --- DEFINICIÓN DE RUTAS ---

registry.registerPath({
  method: 'get',
  path: '/api/productos',
  description: 'Obtiene el listado de todos los productos',
  summary: 'Listar Productos',
  tags: ['Productos'],
  responses: {
    200: {
      description: 'Lista de productos recuperada con éxito',
      content: {
        'application/json': {
          schema: z.array(ProductoSchema),
        },
      },
    },
  },
});

// --- GENERACIÓN DEL DOCUMENTO ---

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'API Tienda Ejercicio',
    version: '1.0.0',
    description: 'API documentada automáticamente con Zod y OpenAPI',
  },
  servers: [
    { url: '/api' },
  ],
});