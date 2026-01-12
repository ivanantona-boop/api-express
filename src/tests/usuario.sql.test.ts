import sqlite3 from 'sqlite3';
import { UsuarioRepository } from '../repository/usuario.repository';

describe('UsuarioRepository - Validación SQL Real', () => {
    let db: sqlite3.Database;
    let repo: UsuarioRepository;

    // 1. Antes de los tests, creamos una base de datos real en RAM
    beforeAll((done) => {
        // ':memory:' asegura que la BD sea temporal y ultra rápida
        db = new sqlite3.Database(':memory:');
        
        // Creamos la tabla real para validar que el SQL del repo encaje con ella
        db.run(`
            CREATE TABLE usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                apellidos TEXT,
                email TEXT,
                contraseña TEXT
            )
        `, () => {
            repo = new UsuarioRepository(db);
            done();
        });
    });

    // 2. Cerramos la conexión al terminar
    afterAll((done) => {
        db.close(done);
    });

    it('debería ejecutar el INSERT correctamente (Valida sintaxis SQL)', async () => {
        const nuevo = { nombre: "Juan", apellidos: "SQL", email: "sql@test.com", contraseña: "123" };
        
        // Si el SQL tiene errores, esta llamada lanzará una excepción
        const resultado = await repo.create(nuevo);
        
        expect(resultado).toHaveProperty('id');
        expect(resultado.id).toBe(1);
    });

    it('debería fallar si intentamos una operación SQL inválida', async () => {
        // Aquí podrías probar errores de constraints (ej: campos NULL que no deberían serlo)
    });
});