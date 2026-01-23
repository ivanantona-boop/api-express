import app from './app'; // IMPORTANTE: Importamos la app ya configurada en app.ts
import { config } from './Infraestructura/config/env';
import { connectMongoDB } from './Infraestructura/database/mongo';

const startServer = async () => {
  try {
    // 1. Conectamos a la Base de Datos
    await connectMongoDB();

    // 2. Arrancamos el servidor
    // Usamos la instancia 'app' que importamos arriba
    app.listen(config.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
      console.log(`Documentación Swagger: http://localhost:${config.PORT}/api-docs`);
      console.log(`Rutas activas:`);
      console.log(`   - /api/usuarios`);
      console.log(`   - /api/ejercicios`);
      console.log(`   - /api/planes`);
      console.log(`   - /api/sesiones`);
    });
  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};

// 3. Ejecutar
startServer();
