import sqlite3 from 'sqlite3';

// Abre la base de datos (se creará el archivo 'mi_tienda.db' en la raíz)
const db = new sqlite3.Database('mi_tienda.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    
    // Crear tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      precio REAL
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla:', err.message);
      } else {
        console.log('Tabla productos lista.');
      }
    });
    //---tabla Usuarios -----
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla usuarios:', err.message);
      } else {
        console.log('Tabla usuarios lista.');
      }
    });
  }
});

export default db;