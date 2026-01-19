import app from './app';
import { config } from './Infraestructura/config/env'; // Importamos la config

// Usamos config.PORT en lugar del número fijo
const port = config.PORT;

app.listen(port, () => {
  // Feedback visual del entorno
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Entorno: ${config.NODE_ENV}`);
});