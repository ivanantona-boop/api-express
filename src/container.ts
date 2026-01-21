// --- USUARIO (Migrado a Mongo y Hexagonal) ✅ ---
import { UsuarioMongoRepository } from './Infraestructura/repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';
import { UsuarioService } from './Aplicacion/services/usuario.service';
import { UsuarioController } from './Infraestructura/controllers/usuario.controller';

// --- OTROS (Pendientes de migrar, comentados para que no falle) 🚧 ---
// import { ProductoRepository } from './Infraestructura/repository/producto.repository';
// import { ProductoService } from './Aplicacion/services/producto.service';
// import { ProductoController } from './Infraestructura/controllers/productos.controller';

// import { EjercicioRepository } from './Infraestructura/repository/ejercicio.repository';
// import { EjercicioService } from './Aplicacion/services/ejercicio.service';
// import { EjercicioController } from './Infraestructura/controllers/ejercicio.controller';

const isTest = process.env.NODE_ENV === 'test';

// 1. Repositorios
// Nota: UsuarioMongoRepository ya no necesita 'db', se conecta solo vía Mongoose.
const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioMongoRepository();

// ⚠️ COMENTADO HASTA QUE MIGRES PRODUCTOS A MONGO
// const productoRepo = new ProductoRepository(db); <--- Esto fallaba porque 'db' no existe
// const ejercicioRepo = new EjercicioRepository(db);

// 2. Servicios
const usuarioService = new UsuarioService(usuarioRepo);
// const productoService = new ProductoService(productoRepo);
// const ejercicioService = new EjercicioService(ejercicioRepo);

// 3. Controladores
const usuarioController = new UsuarioController(usuarioService);
// const productoController = new ProductoController(productoService);
// const ejercicioController = new EjercicioController(ejercicioService);

// 4. Exportar
export {
  usuarioController,
  // productoController,
  // ejercicioController
};
