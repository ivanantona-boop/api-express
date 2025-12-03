import express from 'express';
import productosRouter from './routes/productos.routes';

const app = express();
const port = 3000;

// 1. ESTA ES LA LÍNEA MÁGICA QUE TE FALTA O ESTÁ MAL COLOCADA
// Sin esto, req.body siempre será undefined
app.use(express.json()); 

// 2. Las rutas van DESPUÉS del json()
app.use('/api/productos', productosRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});