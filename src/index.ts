import express from 'express';
import productosRouter from './infrastructure/http/routes/productos.routes';
import usuariosRouter from './infrastructure/http/routes/usuario.route';

const app = express();
const port = 3000;

// Composition Root: aquí se cablean los adaptadores con el framework Express.
// Idea hexagonal: el framework es un detalle. Si cambia el servidor HTTP, solo tocamos este archivo.
// 1. ESTA ES LA LÍNEA MÁGICA QUE TE FALTA O ESTÁ MAL COLOCADA
// Sin esto, req.body siempre será undefined
app.use(express.json()); 

// 2. Las rutas van DESPUÉS del json()
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
