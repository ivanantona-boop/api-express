import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express'; // <--- IMPORTAR ESTO
import { openApiSpec } from './Infraestructura/config/swagger'; // <--- IMPORTAR LA CONFIG
import { config } from './Infraestructura/config/env';

// ... tus imports de rutas ...
import productosRouter from './Infraestructura/routes/productos.routes';
import usuariosRouter from './Infraestructura/routes/usuario.route';
import ejercicioRouter from './Infraestructura/routes/ejercicio.routes';

const app = express();

// ... tus middlewares de seguridad (Helmet, CORS, RateLimit) ...
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));

// --- NUEVO: RUTA DE DOCUMENTACIÓN ---
// Solo la mostramos si NO estamos en producción (por seguridad) o si tú quieres
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
// ------------------------------------

app.use(express.json());

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ejercicios', ejercicioRouter);

export default app;