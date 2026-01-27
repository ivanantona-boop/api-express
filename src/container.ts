import NodeCache from 'node-cache';

// importación de servicios (capa de aplicación - fachada)
import { UsuarioService } from './Aplicacion/services/usuario.service';
import { EjercicioService } from './Aplicacion/services/ejercicio.service';
import { PlanService } from './Aplicacion/services/plan.service';
import { SesionService } from './Aplicacion/services/sesion.service';

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
// nota: algunos servicios instancian su propia caché interna según lo definido anteriormente
const isTest = process.env.NODE_ENV === 'test';
const appCache = new NodeCache({ stdTTL: 300 });

// =============================================================
// capa 1: infraestructura (repositorios)
// =============================================================

// instanciación de repositorios según el entorno de ejecución
const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioMongoRepository();
const ejercicioRepo = isTest ? new EjercicioMockRepository() : new EjercicioMongoRepository();
const planRepo = isTest ? new PlanMockRepository() : new PlanMongoRepository();
const sesionRepo = isTest ? new SesionMockRepository() : new SesionMongoRepository();

// =============================================================
// capa 2: aplicación (servicios)
// =============================================================

// instanciación de servicios inyectando repositorios y caché cuando corresponde
// el servicio de usuario utiliza la caché compartida
const usuarioService = new UsuarioService(usuarioRepo, appCache);

// los siguientes servicios gestionan su caché internamente o solo requieren el repositorio
const ejercicioService = new EjercicioService(ejercicioRepo);
const planService = new PlanService(planRepo);
const sesionService = new SesionService(sesionRepo);

// =============================================================
// capa 3: infraestructura (controladores)
// =============================================================

// inyección de los servicios en los controladores
// ahora los controladores reciben un único objeto servicio en lugar de múltiples casos de uso
const usuarioController = new UsuarioController(usuarioService);
const ejercicioController = new EjercicioController(ejercicioService);
const planController = new PlanController(planService);
const sesionController = new SesionController(sesionService);

// =============================================================
// exportación del contenedor de dependencias
// =============================================================
export { usuarioController, ejercicioController, planController, sesionController };
