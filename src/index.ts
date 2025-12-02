import express from 'express';
import productosRouter from './routes/productos.routes'; // Importamos las rutas

const app = express();
const port = 3000;

app.use(express.json());

// Aquí conectamos nuestras rutas.
// Decimos: "Todo lo que empiece por /api/productos, mándalo al archivo de rutas"
app.use('/api/productos', productosRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});