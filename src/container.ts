// --- 1. USUARIO (Ya migrado y funcionando) ---
import { UsuarioMongoRepository } from './Infraestructura/repository/usuario.mongo.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';
import { UsuarioService } from './Aplicacion/services/usuario.service';
import { UsuarioController } from './Infraestructura/controllers/usuario.controller';

// --- 2. EJERCICIO (Repositorios nuevos)  ---
import { EjercicioMongoRepository } from './Infraestructura/repository/ejercicio.mongo.repository';
import { EjercicioMockRepository } from './Infraestructura/repository/ejercicio.mock.repository';
import { EjercicioService } from './Aplicacion/services/ejercicio.service';
import { EjercicioController } from './Infraestructura/controllers/ejercicio.controller';

// --- 3. PLAN DE ENTRENAMIENTO (Repositorios nuevos) ---
import { PlanMongoRepository } from './Infraestructura/repository/plan.mongo.repository';
import { PlanMockRepository } from './Infraestructura/repository/plan.mock.repository';
import { PlanService } from './Aplicacion/services/plan.service';
import { PlanController } from './Infraestructura/controllers/plan.controller';

// --- 4. SESIÓN (Repositorios nuevos) ---
import { SesionMongoRepository } from './Infraestructura/repository/sesion.mongo.repository';
import { SesionMockRepository } from './Infraestructura/repository/sesion.mock.repository';
import { SesionService } from './Aplicacion/services/sesion.service';
import { SesionController } from './Infraestructura/controllers/sesion.controller';

const isTest = process.env.NODE_ENV === 'test';

// =============================================================
// CAPA 1: REPOSITORIOS (Infraestructura - Acceso a Datos)
// =============================================================

// Usuario
const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioMongoRepository();

// Nuevas Entidades (Ya conectadas a Mongo)
const ejercicioRepo = isTest ? new EjercicioMockRepository() : new EjercicioMongoRepository();
const planRepo = isTest ? new PlanMockRepository() : new PlanMongoRepository();
const sesionRepo = isTest ? new SesionMockRepository() : new SesionMongoRepository();

// =============================================================
// CAPA 2: SERVICIOS (Aplicación - Lógica de Negocio)
// =============================================================

const usuarioService = new UsuarioService(usuarioRepo);

const ejercicioService = new EjercicioService(ejercicioRepo);
const planService = new PlanService(planRepo);
const sesionService = new SesionService(sesionRepo);

// =============================================================
// CAPA 3: CONTROLADORES (Infraestructura - Rutas HTTP)
// =============================================================

const usuarioController = new UsuarioController(usuarioService);

const ejercicioController = new EjercicioController(ejercicioService);
const planController = new PlanController(planService);
const sesionController = new SesionController(sesionService);

// =============================================================
// EXPORTAR
// =============================================================
export { usuarioController, ejercicioController, planController, sesionController };
