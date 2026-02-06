import NodeCache from 'node-cache';

// importación de servicios (capa de aplicación - fachada)
import { UsuarioService } from './Aplicacion/services/usuario.service';
import { EjercicioService } from './Aplicacion/services/ejercicio.service';
import { PlanService } from './Aplicacion/services/plan.service';
import { SesionService } from './Aplicacion/services/sesion.service';

// importación de casos de uso ---
import { LoginUsuarioUseCase } from './Aplicacion/use-cases/usuario/login-usuario.use-case';
import { ListarClientesUseCase } from './Aplicacion/use-cases/usuario/listar-clientes.use-case'; // revisa si tu archivo acaba en .usecase o .use-case

// importación de repositorios (capa de infraestructura)
import { UsuarioMongoRepository } from './Infraestructura/repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';
import { EjercicioMongoRepository } from './Infraestructura/repository/ejercicio.mongo.repository';
import { EjercicioMockRepository } from './Infraestructura/repository/ejercicio.mock.repository';
import { PlanMongoRepository } from './Infraestructura/repository/plan.mongo.repository';
import { PlanMockRepository } from './Infraestructura/repository/plan.mock.repository';
import { SesionMongoRepository } from './Infraestructura/repository/sesion.mongo.repository';
import { SesionMockRepository } from './Infraestructura/repository/sesion.mock.repository';

// importación de controladores (capa de infraestructura)
import { UsuarioController } from './Infraestructura/controllers/usuario.controller';
import { EjercicioController } from './Infraestructura/controllers/ejercicio.controller';
import { PlanController } from './Infraestructura/controllers/plan.controller';
import { SesionController } from './Infraestructura/controllers/sesion.controller';

// configuración de entorno y caché general
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
// capa 2: aplicación (servicios y casos de uso)
// =============================================================

// Servicios Legacy
const usuarioService = new UsuarioService(usuarioRepo, appCache);
const ejercicioService = new EjercicioService(ejercicioRepo);
const planService = new PlanService(planRepo);
const sesionService = new SesionService(sesionRepo);

// --- Instanciamos los Casos de Uso ---
const loginUseCase = new LoginUsuarioUseCase(usuarioRepo);
const listarClientesUseCase = new ListarClientesUseCase(usuarioRepo, appCache);

// =============================================================
// capa 3: infraestructura (controladores)
// =============================================================

// inyección de dependencias en los controladores
const usuarioController = new UsuarioController(
  usuarioService, // 1. Servicio (Legacy)
  loginUseCase, // 2. Caso de Uso Login
  listarClientesUseCase, // 3. Caso de Uso Listar Clientes
);

const ejercicioController = new EjercicioController(ejercicioService);
const planController = new PlanController(planService);
const sesionController = new SesionController(sesionService);

// =============================================================
// exportación del contenedor de dependencias
// =============================================================
export { usuarioController, ejercicioController, planController, sesionController };
