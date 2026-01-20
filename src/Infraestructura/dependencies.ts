import { UsuarioMongoRepository } from './repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './repository/usuario.mock.repository'; // <--- Importar el Mock
import { UsuarioService } from '../Aplicacion/services/usuario.service';
import { UsuarioController } from './controllers/usuario.controller';

// Detectamos si estamos en modo test
const isTest = process.env.NODE_ENV === 'test';

// 1. Elegimos el repositorio según el entorno
// Si es test -> Mock. Si es prod/dev -> Mongo.
const usuarioRepository = isTest 
    ? new UsuarioMockRepository() 
    : new UsuarioMongoRepository();

// 2. Inyectamos
const usuarioService = new UsuarioService(usuarioRepository);

// 3. Exportamos el controlador ya montado
export const usuarioController = new UsuarioController(usuarioService);