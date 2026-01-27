import NodeCache from 'node-cache';

// importación de casos de uso de usuario
import { CrearUsuarioUseCase } from './Aplicacion/use-cases/usuario/crear-usuario.use-case';
import { ListarUsuariosUseCase } from './Aplicacion/use-cases/usuario/listar-usuarios.use-case';
import { BuscarUsuarioPorDniUseCase } from './Aplicacion/use-cases/usuario/buscar-usuario-por-dni.use-case';
import { ActualizarUsuarioUseCase } from './Aplicacion/use-cases/usuario/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from './Aplicacion/use-cases/usuario/eliminar-usuario.use-case';

// importación de casos de uso de ejercicio
import { CrearEjercicioUseCase } from './Aplicacion/use-cases/ejercicio/crear-ejercicio.use-case';
import { ListarEjerciciosUseCase } from './Aplicacion/use-cases/ejercicio/listar-ejercicios.use-case';
import { ObtenerEjercicioPorIdUseCase } from './Aplicacion/use-cases/ejercicio/obtener-ejercicio-por-id.use-case';
import { EliminarEjercicioUseCase } from './Aplicacion/use-cases/ejercicio/eliminar-ejercicio.use-case';

// importación de casos de uso de plan
import { CrearPlanUseCase } from './Aplicacion/use-cases/plan/crear-plan.use-case';
import { ObtenerPlanesUsuarioUseCase } from './Aplicacion/use-cases/plan/obtener-planes-usuario.use-case';
import { ObtenerPlanPorIdUseCase } from './Aplicacion/use-cases/plan/obtener-plan-por-id.use-case';
import { ActualizarPlanUseCase } from './Aplicacion/use-cases/plan/actualizar-plan.use-case';
import { EliminarPlanUseCase } from './Aplicacion/use-cases/plan/eliminar-plan.use-case';

// importación de casos de uso de sesión
import { CrearSesionUseCase } from './Aplicacion/use-cases/sesion/crear-sesion.use-case';
import { ObtenerSesionesPlanUseCase } from './Aplicacion/use-cases/sesion/obtener-sesiones-plan.use-case';
import { ObtenerSesionPorIdUseCase } from './Aplicacion/use-cases/sesion/obtener-sesion-por-id.use-case';
import { ActualizarSesionUseCase } from './Aplicacion/use-cases/sesion/actualizar-sesion.use-case';
import { EliminarSesionUseCase } from './Aplicacion/use-cases/sesion/eliminar-sesion.use-case';

// importación de repositorios
import { UsuarioMongoRepository } from './Infraestructura/repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';
import { EjercicioMongoRepository } from './Infraestructura/repository/ejercicio.mongo.repository';
import { EjercicioMockRepository } from './Infraestructura/repository/ejercicio.mock.repository';
import { PlanMongoRepository } from './Infraestructura/repository/plan.mongo.repository';
import { PlanMockRepository } from './Infraestructura/repository/plan.mock.repository';
import { SesionMongoRepository } from './Infraestructura/repository/sesion.mongo.repository';
import { SesionMockRepository } from './Infraestructura/repository/sesion.mock.repository';

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

const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioMongoRepository();
const ejercicioRepo = isTest ? new EjercicioMockRepository() : new EjercicioMongoRepository();
const planRepo = isTest ? new PlanMockRepository() : new PlanMongoRepository();
const sesionRepo = isTest ? new SesionMockRepository() : new SesionMongoRepository();

// =============================================================
// capa 2: aplicación (casos de uso)
// =============================================================

// casos de uso usuario
const crearUsuarioUseCase = new CrearUsuarioUseCase(usuarioRepo, appCache);
const listarUsuariosUseCase = new ListarUsuariosUseCase(usuarioRepo, appCache);
const buscarUsuarioPorDniUseCase = new BuscarUsuarioPorDniUseCase(usuarioRepo);
const actualizarUsuarioUseCase = new ActualizarUsuarioUseCase(usuarioRepo, appCache);
const eliminarUsuarioUseCase = new EliminarUsuarioUseCase(usuarioRepo, appCache);

// casos de uso ejercicio
const crearEjercicioUseCase = new CrearEjercicioUseCase(ejercicioRepo, appCache);
const listarEjerciciosUseCase = new ListarEjerciciosUseCase(ejercicioRepo, appCache);
const obtenerEjercicioPorIdUseCase = new ObtenerEjercicioPorIdUseCase(ejercicioRepo);
const eliminarEjercicioUseCase = new EliminarEjercicioUseCase(ejercicioRepo, appCache);

// casos de uso plan
const crearPlanUseCase = new CrearPlanUseCase(planRepo, appCache);
const obtenerPlanesUsuarioUseCase = new ObtenerPlanesUsuarioUseCase(planRepo, appCache);
const obtenerPlanPorIdUseCase = new ObtenerPlanPorIdUseCase(planRepo);
const actualizarPlanUseCase = new ActualizarPlanUseCase(planRepo, appCache);
const eliminarPlanUseCase = new EliminarPlanUseCase(planRepo, appCache);

// casos de uso sesión
const crearSesionUseCase = new CrearSesionUseCase(sesionRepo, appCache);
const obtenerSesionesPlanUseCase = new ObtenerSesionesPlanUseCase(sesionRepo, appCache);
const obtenerSesionPorIdUseCase = new ObtenerSesionPorIdUseCase(sesionRepo);
const actualizarSesionUseCase = new ActualizarSesionUseCase(sesionRepo, appCache);
const eliminarSesionUseCase = new EliminarSesionUseCase(sesionRepo, appCache);

// =============================================================
// capa 3: infraestructura (controladores)
// =============================================================

const usuarioController = new UsuarioController(
  crearUsuarioUseCase,
  listarUsuariosUseCase,
  buscarUsuarioPorDniUseCase,
  actualizarUsuarioUseCase,
  eliminarUsuarioUseCase,
);

const ejercicioController = new EjercicioController(
  crearEjercicioUseCase,
  listarEjerciciosUseCase,
  obtenerEjercicioPorIdUseCase,
  eliminarEjercicioUseCase,
);

const planController = new PlanController(
  crearPlanUseCase,
  obtenerPlanPorIdUseCase,
  obtenerPlanesUsuarioUseCase,
  actualizarPlanUseCase,
  eliminarPlanUseCase,
);

const sesionController = new SesionController(
  crearSesionUseCase,
  obtenerSesionPorIdUseCase,
  obtenerSesionesPlanUseCase,
  actualizarSesionUseCase,
  eliminarSesionUseCase,
);

// =============================================================
// exportación del contenedor de dependencias
// =============================================================
export { usuarioController, ejercicioController, planController, sesionController };
