import express from 'express';
import productosRouter from './routes/productos.routes';
import usuariosRouter from './routes/usuario.route';

const app = express();

// Middleware para entender JSON
app.use(express.json()); 

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);

// EXPORTAMOS LA APP (Esto es lo que usará Supertest)
export default app;