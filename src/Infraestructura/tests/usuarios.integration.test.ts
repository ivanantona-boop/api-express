import request from 'supertest';
import app from '../../app';

// Forzamos el entorno test por si acaso
process.env.NODE_ENV = 'test';

describe('API Usuarios - Tests de Integración', () => {

    /**
     * PRUEBAS PARA CÓDIGO 400 (BAD REQUEST)
     */
    it('POST /api/usuarios - Debería devolver 400 si faltan campos (DNI)', async () => {
        const res = await request(app)
            .post('/api/usuarios')
            .send({ 
                nombre: "SoloNombre",
                // Falta apellidos, contraseña y DNI
            }); 

        expect(res.status).toBe(400);
        // Según tu controlador, el error viene dentro de la propiedad 'error'
        expect(res.body).toHaveProperty('error');
    });

    /**
     * PRUEBAS PARA CÓDIGO 404 (NOT FOUND)
     */
    it('GET /api/usuarios/:dni - Debería devolver 404 si el DNI no existe', async () => {
        // Buscamos un DNI que no hemos creado
        const res = await request(app).get('/api/usuarios/DNI_INEXISTENTE'); 
        
        expect(res.status).toBe(404);
        expect(res.body.error).toContain('no encontrado');
    });

    it('DELETE /api/usuarios/:dni - Debería devolver 404 al borrar un DNI inexistente', async () => {
        const res = await request(app).delete('/api/usuarios/DNI_FANTASMA');
        
        expect(res.status).toBe(404);
    });

    /**
     * PRUEBAS DE FLUJO EXITOSO (201 CREATED)
     */
    it('POST /api/usuarios - Debería devolver 201 si enviamos todos los datos', async () => {
        const nuevoUsuario = {
            nombre: "Test",
            apellidos: "User",
            email: "test@mail.com", // Ojo: Aunque Zod lo pide, asegurate que tu Mock o Model lo tengan
            contraseña: "123456password", // Mínimo 6 caracteres según tu Zod
            DNI: "12345678Z" // ¡AHORA ES OBLIGATORIO!
        };

        const res = await request(app).post('/api/usuarios').send(nuevoUsuario);
        
        // Debug: Si falla, imprime el error para ver qué dice Zod
        if (res.status !== 201) {
            console.error("Error en test POST:", res.body);
        }

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id'); // El mock genera un ID string
        expect(res.body.nombre).toBe(nuevoUsuario.nombre);
    });

    /**
     * PRUEBA DE FLUJO COMPLETO (Crear -> Leer -> Borrar)
     * Esto asegura que la persistencia del Mock funciona
     */
    it('Flujo E2E: Crear usuario y luego consultarlo', async () => {
        const dniPrueba = "99999999X";
        
        // 1. Crear
        await request(app).post('/api/usuarios').send({
            nombre: "Flujo",
            apellidos: "Completo",
            contraseña: "password123",
            DNI: dniPrueba,
            email: "flujo@test.com"
        });

        // 2. Consultar por DNI
        const res = await request(app).get(`/api/usuarios/${dniPrueba}`);
        
        expect(res.status).toBe(200);
        expect(res.body.DNI).toBe(dniPrueba);
    });
});