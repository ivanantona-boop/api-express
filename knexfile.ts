import 'dotenv/config'; 
import type { Knex } from 'knex';

const dbPath = process.env.DB_PATH || './mi_tienda.db';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  migrations: {
    // Aquí es donde se guardarán los historiales de cambios
    directory: './src/Infraestructura/database/migrations',
    extension: 'ts'
  },
  seeds: {
    // Aquí es donde se guardarán los datos de prueba
    directory: './src/Infraestructura/database/seeds',
    extension: 'ts'
  }
};

export default config;