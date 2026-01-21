import mongoose from 'mongoose';
// 1. IMPORTANTE: Ya no importamos 'dotenv' aquí, sino nuestra config validada
import { config } from '../config/env';

export const connectMongoDB = async (): Promise<void> => {
  try {
    // 2. Usamos config.MONGO_URI en vez de process.env...
    // 3. Añadimos el Pooling (maxPoolSize) usando la variable que definimos
    await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: config.DB_POOL_SIZE, // Esto controla la escalabilidad
      serverSelectionTimeoutMS: 5000, // Tiempo límite para intentar conectar
    });

    console.log(`Base de datos conectada: ${config.MONGO_URI}`);
    console.log(`Pool de conexiones: ${config.DB_POOL_SIZE}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1); // Detiene la app si no hay base de datos
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB desconectado');
  } catch (error) {
    console.error('Error desconectando:', error);
  }
};
