import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './Infraestructura/config/swagger';

// 1. IMPORTAR CONFIG (Necesario para CORS y Health check)
import { config } from './Infraestructura/config/env';

// Importación de rutas
import { usuarioRouter } from './Infraestructura/routes/usuario.route';
import { ejercicioRouter } from './Infraestructura/routes/ejercicio.route';
import { planRouter } from './Infraestructura/routes/plan.route';
import { sesionRouter } from './Infraestructura/routes/sesion.route';

const app = express();

// Middlewares Globales
app.use(helmet());

// 2. USAR CONFIG EN CORS (Mejor seguridad que dejarlo abierto a todo el mundo)
app.use(cors({ origin: config.CORS_ORIGIN }));

app.use(express.json());

// --- RUTA DE DOCUMENTACIÓN SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// --- RUTAS DE LA API (Te faltaban las 3 nuevas) ---
app.use('/api/usuarios', usuarioRouter);
app.use('/api/ejercicios', ejercicioRouter);
app.use('/api/planes', planRouter);
app.use('/api/sesiones', sesionRouter);

// Ruta base
app.get('/', (req, res) => {
  res.send('API Hexagonal Funcionando 🚀. Ve a /api-docs para ver la documentación.');
});

// Ruta de Salud (Útil para saber en qué entorno estás)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: config.NODE_ENV });
});

export default app;
