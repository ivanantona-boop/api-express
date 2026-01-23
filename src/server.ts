import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './Infraestructura/config/env';
import { connectMongoDB } from './Infraestructura/database/mongo';
import { usuarioController } from './container'; // Importamos el controlador ya instanciado

// 1. Inicializamos la App
const app = express();

// 2. Middlewares de Seguridad y Parsing
app.use(helmet()); // Protege cabeceras HTTP
app.use(cors({ origin: config.CORS_ORIGIN })); // Permite peticiones desde otros dominios
app.use(express.json()); // Para entender JSON en el body

// 3. Rutas (Aquí usamos el controlador que ya tienes)

// --- A. Crear Usuario (POST) ---
// Usamos .createUsuario porque así se llama en tu Controller
app.post('/api/usuarios', (req, res) => usuarioController.createUsuario(req, res));

// --- B. Obtener Todos (GET) ---
// Usamos .getUsuarios porque así se llama en tu Controller
app.get('/api/usuarios', (req, res) => usuarioController.getUsuarios(req, res));

// --- C. Obtener por DNI (GET con parámetro) ---
// Usamos .getUsuarioByDNI porque así se llama en tu Controller
app.get('/api/usuarios/:dni', (req, res) => usuarioController.getUsuarioByDNI(req, res));

// --- D. Actualizar Usuario (PUT) ---
// Usamos .updateUsuario porque así se llama en tu Controller
app.put('/api/usuarios/:dni', (req, res) => usuarioController.updateUsuario(req, res));

// --- E. Eliminar Usuario (DELETE) ---
// Usamos .deleteUsuario porque así se llama en tu Controller
app.delete('/api/usuarios/:dni', (req, res) => usuarioController.deleteUsuario(req, res));

// Ruta de salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: config.NODE_ENV });
});

// 4. Función de Arranque
const startServer = async () => {
  try {
    // A. Conectamos a la Base de Datos (Mongo)
    await connectMongoDB();

    // B. Arrancamos el servidor Express
    app.listen(config.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
      console.log(`Entorno: ${config.NODE_ENV}`);
      console.log(`Rutas disponibles en /api/usuarios`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// 5. Ejecutar
startServer();
