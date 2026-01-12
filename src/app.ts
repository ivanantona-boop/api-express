import express from 'express';
import productosRouter from './routes/productos.routes';
import usuariosRouter from './routes/usuario.route';
import ejercicioRouter from './routes/ejercicio.routes';

const app = express();

// Middleware para entender JSON
app.use(express.json()); 

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ejercicios', ejercicioRouter);

// EXPORTAMOS LA APP (Esto es lo que usará Supertest)
export default app;