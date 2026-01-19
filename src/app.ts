import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './Infraestructura/config/env'; // Importamos la config tipada

import productosRouter from './Infraestructura/routes/productos.routes';
import usuariosRouter from './Infraestructura/routes/usuario.route';
import ejercicioRouter from './Infraestructura/routes/ejercicio.routes';

const app = express();

// 1. HELMET: Protege encabezados HTTP (siempre el primero)
app.use(helmet());

// 2. CORS: Controla quién puede acceder a tu API
app.use(cors({
  origin: config.CORS_ORIGIN, // Leemos de la config
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// 3. RATE LIMIT: Evita ataques de fuerza bruta o DoS
// Solo lo activamos si NO estamos corriendo tests (para no bloquear a Supertest)
if (config.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP cada 15 min
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
  });
  app.use(limiter);
}

// Middleware para entender JSON
app.use(express.json()); 

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ejercicios', ejercicioRouter);

// EXPORTAMOS LA APP
export default app;