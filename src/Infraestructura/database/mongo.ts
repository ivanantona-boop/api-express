import mongoose from 'mongoose';
import 'dotenv/config'; // Asegura que carga las variables de entorno

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mi_tienda';

export const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Base de datos conectada: ${MONGO_URI}`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Detiene la app si no hay base de datos
    }
};

export const disconnectMongoDB = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log(`MongoDB desconectado`);
};