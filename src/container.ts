import NodeCache from 'node-cache';

// importación de casos de uso de usuario
import { CrearUsuarioUseCase } from './Aplicacion/use-cases/usuario/crear-usuario.use-case';
import { ListarUsuariosUseCase } from './Aplicacion/use-cases/usuario/listar-usuarios.use-case';
import { BuscarUsuarioPorDniUseCase } from './Aplicacion/use-cases/usuario/buscar-usuario-por-dni.use-case';
import { ActualizarUsuarioUseCase } from './Aplicacion/use-cases/usuario/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from './Aplicacion/use-cases/usuario/eliminar-usuario.use-case';

// importación de repositorios
import { UsuarioMongoRepository } from './Infraestructura/repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';
import { EjercicioMongoRepository } from './Infraestructura/repository/ejercicio.mongo.repository';
import { EjercicioMockRepository } from './Infraestructura/repository/ejercicio.mock.repository';
import { PlanMongoRepository } from './Infraestructura/repository/plan.mongo.repository';
import { PlanMockRepository } from './Infraestructura/repository/plan.mock.repository';
import { SesionMongoRepository } from './Infraestructura/repository/sesion.mongo.repository';
import { SesionMockRepository } from './Infraestructura/repository/sesion.mock.repository';

// importación de servicios (entidades no migradas a casos de uso)
import { EjercicioService } from './Aplicacion/services/ejercicio.service';
import { PlanService } from './Aplicacion/services/plan.service';
import { SesionService } from './Aplicacion/services/sesion.service';

// importación de controladores
import { UsuarioController } from './Infraestructura/controllers/usuario.controller';
import { EjercicioController } from './Infraestructura/controllers/ejercicio.controller';
import { PlanController } from './Infraestructura/controllers/plan.controller';
import { SesionController } from './Infraestructura/controllers/sesion.controller';

// configuración general y caché compartida
const isTest = process.env.NODE_ENV === 'test';
const appCache = new NodeCache({ stdTTL: 300 });

// =============================================================
// capa 1: infraestructura (repositorios)
// =============================================================

// selección de repositorio según el entorno (test o producción)
const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioMongoRepository();
const ejercicioRepo = isTest ? new EjercicioMockRepository() : new EjercicioMongoRepository();
const planRepo = isTest ? new PlanMockRepository() : new PlanMongoRepository();
const sesionRepo = isTest ? new SesionMockRepository() : new SesionMongoRepository();

// =============================================================
// capa 2: aplicación (casos de uso y servicios)
// =============================================================

// instanciación de casos de uso para usuario (inyección de repositorio y caché)
const crearUsuarioUseCase = new CrearUsuarioUseCase(usuarioRepo, appCache);
const listarUsuariosUseCase = new ListarUsuariosUseCase(usuarioRepo, appCache);
const buscarUsuarioPorDniUseCase = new BuscarUsuarioPorDniUseCase(usuarioRepo);
const actualizarUsuarioUseCase = new ActualizarUsuarioUseCase(usuarioRepo, appCache);
const eliminarUsuarioUseCase = new EliminarUsuarioUseCase(usuarioRepo, appCache);

// instanciación de servicios para el resto de entidades
const ejercicioService = new EjercicioService(ejercicioRepo);
const planService = new PlanService(planRepo);
const sesionService = new SesionService(sesionRepo);

// =============================================================
// capa 3: infraestructura (controladores)
// =============================================================

// inyección de dependencias en los controladores
const usuarioController = new UsuarioController(
  crearUsuarioUseCase,
  listarUsuariosUseCase,
  buscarUsuarioPorDniUseCase,
  actualizarUsuarioUseCase,
  eliminarUsuarioUseCase,
);

const ejercicioController = new EjercicioController(ejercicioService);
const planController = new PlanController(planService);
const sesionController = new SesionController(sesionService);

// =============================================================
// exportación del contenedor de dependencias
// =============================================================
export { usuarioController, ejercicioController, planController, sesionController };
