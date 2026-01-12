import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('mi_tienda.db', (err) => {
  if (err) console.error('Error:', err.message);
  else {
    // Tabla Productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL
    )`);

    // Tabla Usuarios (Sincronizada con apellidos y contraseña)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT,
      email TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL
    )`);

    // Tabla Ejercicios (Sincronizada con tu repositorio)
    db.run(`CREATE TABLE IF NOT EXISTS ejercicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    )`);
  }
});

export default db;