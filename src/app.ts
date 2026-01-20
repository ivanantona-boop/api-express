import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express'; // <--- Importar la UI
import { openApiSpec } from './Infraestructura/config/swagger'; // <--- Importar tu config

import usuarioRouter from './Infraestructura/routes/usuario.route';

const app = express();

// Middlewares Globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- RUTA DE DOCUMENTACIÓN SWAGGER ---
// Esto hace que /api-docs renderice la web bonita
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Rutas de la API
app.use('/api/usuarios', usuarioRouter);

// Ruta base
app.get('/', (req, res) => {
    res.send('API Hexagonal Funcionando 🚀. Ve a /api-docs para ver la documentación.');
});

export default app;