import request from 'supertest';
import app from '../../app';

// CONFIGURACIÓN INICIAL
// Establecemos el entorno en 'test' para que el archivo 'src/container.ts'
// inyecte automáticamente el UsuarioMockRepository (memoria) en lugar del de SQLite.
process.env.NODE_ENV = 'test';

describe('API Usuarios - Flujos de Error y Contratos', () => {

    /**
     * PRUEBAS PARA CÓDIGO 400 (BAD REQUEST)
     * Estos tests verifican que la API rechace peticiones mal formadas
     * antes de intentar procesarlas en la lógica de negocio.
     */
    
    it('POST /api/usuarios - Debería devolver 400 si faltan campos obligatorios', async () => {
        // Simulamos un envío donde falta el email y los apellidos
        const res = await request(app)
            .post('/api/usuarios')
            .send({ nombre: "SoloNombre" }); 

        // Verificamos que el servidor responda que la petición es incorrecta
        expect(res.status).toBe(400);
        // El contrato exige que el error sea un JSON con una propiedad 'error'
        expect(res.body).toHaveProperty('error');
        // Verificamos que Zod nos esté enviando los detalles técnicos del fallo
        expect(res.body).toHaveProperty('details');
    });

    it('GET /api/usuarios/:id - Debería devolver 400 si el ID no es un número', async () => {
        // Intentamos pedir un usuario usando un string en el parámetro ID
        const res = await request(app).get('/api/usuarios/no-soy-un-numero');
        
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('ID inválido');
    });

    /**
     * PRUEBAS PARA CÓDIGO 404 (NOT FOUND)
     * Verifican que la API responda correctamente cuando el cliente pide
     * algo que no existe en nuestra "base de datos" (el Mock).
     */

    it('GET /api/usuarios/:id - Debería devolver 404 si el usuario no existe', async () => {
        // Pedimos un ID que sabemos que no se ha creado aún
        const res = await request(app).get('/api/usuarios/999'); 
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Usuario no encontrado');
    });

    it('DELETE /api/usuarios/:id - Debería devolver 404 al intentar borrar un ID inexistente', async () => {
        const res = await request(app).delete('/api/usuarios/999');
        
        expect(res.status).toBe(404);
        // Verificamos que el mensaje de error sea descriptivo
        expect(res.body.error).toContain('no existe');
    });

    /**
     * PRUEBAS DE FLUJO EXITOSO (201 CREATED)
     * Verificamos que cuando el contrato se cumple por parte del cliente,
     * la API responde con éxito y con la estructura de datos correcta.
     */

    it('POST /api/usuarios - Debería devolver 201 si los datos son correctos', async () => {
        const nuevoUsuario = {
            nombre: "Test",
            apellidos: "User",
            email: "test@mail.com",
            contraseña: "123"
        };
        const res = await request(app).post('/api/usuarios').send(nuevoUsuario);
        
        expect(res.status).toBe(201);
        // Verificamos que el objeto devuelto tenga un ID asignado por el repositorio
        expect(res.body).toHaveProperty('id');
    });
});