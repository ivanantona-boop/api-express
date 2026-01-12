import { UsuarioService } from '../services/usuario.service';
import { UsuarioMockRepository } from '../repository/usuario.mock.repository';

describe('UsuarioService (Unit Test)', () => {
    let service: UsuarioService;
    let mockRepo: UsuarioMockRepository;

    beforeEach(() => {
        // Creamos una instancia limpia antes de cada test
        mockRepo = new UsuarioMockRepository();
        service = new UsuarioService(mockRepo);
    });

    it('debería registrar un usuario correctamente a través del servicio', async () => {
        const datos = { nombre: "Unit", apellidos: "Test", email: "unit@test.com", contraseña: "123" };
        const resultado = await service.createUsuario(datos);
        
        expect(resultado).toHaveProperty('id');
        expect(resultado.nombre).toBe("Unit");
    });
});