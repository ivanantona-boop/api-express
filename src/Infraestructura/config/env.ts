// src/Infraestructura/config/env.ts
import 'dotenv/config'; // Carga las variables del archivo .env automáticamente
import { z } from 'zod';

const envSchema = z.object({
  // Validamos que PORT sea un número. Si no existe, usa 3000 por defecto.
  PORT: z.coerce.number().min(1000).default(3000),
  
  // Validamos la ruta de la DB.
  DB_PATH: z.string().default('./data.db'),
  
  // Define en qué entorno estamos
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // CORS: Qué dominios permitimos (ej: "http://mi-frontend.com")
  CORS_ORIGIN: z.string().default('*'), 
});

// Parseamos process.env. Si falla, lanza un error explicativo
export const config = envSchema.parse(process.env);