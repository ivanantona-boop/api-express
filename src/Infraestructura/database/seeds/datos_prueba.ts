import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // 1. Borrar datos existentes (para no duplicar si lo ejecutas varias veces)
    await knex('ejercicios').del();
    await knex('usuarios').del();
    await knex('productos').del();

    // 2. Insertar Productos
    await knex('productos').insert([
        { nombre: 'Zapatillas Running', precio: 59.99 },
        { nombre: 'Mancuernas 5kg', precio: 25.50 },
        { nombre: 'Esterilla Yoga', precio: 12.00 }
    ]);

    // 3. Insertar Usuarios
    await knex('usuarios').insert([
        { 
            nombre: 'Admin', 
            apellidos: 'Sistema',
            email: 'admin@gym.com', 
            contraseña: '123' 
        },
        { 
            nombre: 'Juan', 
            apellidos: 'Pérez',
            email: 'juan@gmail.com', 
            contraseña: 'abc' 
        }
    ]);

    // 4. Insertar Ejercicios
    await knex('ejercicios').insert([
        { nombre: 'Sentadilla', descripcion: 'Espalda recta, bajar hasta 90 grados' },
        { nombre: 'Flexiones', descripcion: 'Pecho al suelo' }
    ]);
};