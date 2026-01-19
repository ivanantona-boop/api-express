import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Tabla Productos
    await knex.schema.createTable('productos', (table) => {
        table.increments('id').primary(); // Equivalente a INTEGER PRIMARY KEY AUTOINCREMENT
        table.string('nombre').notNullable();
        table.float('precio').notNullable();
    });

    // 2. Tabla Usuarios
    await knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('nombre').notNullable();
        table.string('apellidos');
        table.string('email').notNullable().unique();
        table.string('contraseña').notNullable();
    });

    // 3. Tabla Ejercicios
    await knex.schema.createTable('ejercicios', (table) => {
        table.increments('id').primary();
        table.string('nombre').notNullable();
        table.string('descripcion');
    });
}

export async function down(knex: Knex): Promise<void> {
    // Si deshacemos la migración, borramos las tablas en orden inverso
    await knex.schema.dropTableIfExists('ejercicios');
    await knex.schema.dropTableIfExists('usuarios');
    await knex.schema.dropTableIfExists('productos');
}