import sqlite3 from 'sqlite3';
import { config } from './Infraestructura/config/env' 

const db = new sqlite3.Database(config.DB_PATH, (err) => {
  if (err) {
    console.error(`Error conectando a DB:`, err.message);
  } else {
    console.log(`Base de datos conectada: ${config.DB_PATH}`);
  }
});

export default db;