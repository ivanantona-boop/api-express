import app from './app';
import { connectMongoDB } from './Infraestructura/database/mongo';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const start = async () => {
    // 1. Primero conectamos la BD
    await connectMongoDB();

    // 2. Luego levantamos el servidor
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
};

start();