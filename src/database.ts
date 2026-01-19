import sqlite3 from 'sqlite3';
import { config } from './Infraestructura/config/env';

// Usamos config.DB_PATH en lugar del string fijo 'mi_tienda.db'
const db = new sqlite3.Database(config.DB_PATH, (err) => {
  if (err) {
    console.error(`Error al conectar con la base de datos en ${config.DB_PATH}:`, err.message);
  } else {
    console.log(`Base de datos conectada en: ${config.DB_PATH}`);

    // Tabla Productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL
    )`);

    // Tabla Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT,
      email TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL
    )`);

    // Tabla Ejercicios
    db.run(`CREATE TABLE IF NOT EXISTS ejercicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    )`);
  }
});

export default db;