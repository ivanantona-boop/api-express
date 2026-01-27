import { PlanRepository } from '../../Dominio/interfaces/plan/plan.repository.interface';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';
import NodeCache from 'node-cache';

// importación de los casos de uso
import { CrearPlanUseCase } from '../use-cases/plan/crear-plan.use-case';
import { ObtenerPlanesUsuarioUseCase } from '../use-cases/plan/obtener-planes-usuario.use-case';
import { ObtenerPlanPorIdUseCase } from '../use-cases/plan/obtener-plan-por-id.use-case';
import { ActualizarPlanUseCase } from '../use-cases/plan/actualizar-plan.use-case';
import { EliminarPlanUseCase } from '../use-cases/plan/eliminar-plan.use-case';

export class PlanService {
  // definición de propiedades privadas para los casos de uso
  private readonly crearPlanUC: CrearPlanUseCase;
  private readonly obtenerPlanesUsuarioUC: ObtenerPlanesUsuarioUseCase;
  private readonly obtenerPlanPorIdUC: ObtenerPlanPorIdUseCase;
  private readonly actualizarPlanUC: ActualizarPlanUseCase;
  private readonly eliminarPlanUC: EliminarPlanUseCase;

  // instancia de caché local para gestionar la temporalidad de los datos
  private readonly cache: NodeCache;

  constructor(private readonly planRepository: PlanRepository) {
    // inicialización de la caché con un tiempo de vida de 5 minutos (300 segundos)
    this.cache = new NodeCache({ stdTTL: 300 });

    // instanciación de los casos de uso inyectando el repositorio y la caché compartida
    this.crearPlanUC = new CrearPlanUseCase(this.planRepository, this.cache);
    this.obtenerPlanesUsuarioUC = new ObtenerPlanesUsuarioUseCase(this.planRepository, this.cache);
    this.obtenerPlanPorIdUC = new ObtenerPlanPorIdUseCase(this.planRepository);
    this.actualizarPlanUC = new ActualizarPlanUseCase(this.planRepository, this.cache);
    this.eliminarPlanUC = new EliminarPlanUseCase(this.planRepository, this.cache);
  }

  // método fachada para la creación de un nuevo plan
  async crearPlan(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    return await this.crearPlanUC.execute(plan);
  }

  // método fachada para obtener un plan específico por su identificador
  async obtenerPorId(id: string): Promise<PlanEntrenamiento | null> {
    return await this.obtenerPlanPorIdUC.execute(id);
  }

  // método fachada para obtener todos los planes asociados a un usuario
  async obtenerPlanesDeUsuario(idUsuario: string): Promise<PlanEntrenamiento[]> {
    return await this.obtenerPlanesUsuarioUC.execute(idUsuario);
  }

  // método fachada para actualizar un plan existente
  async actualizarPlan(
    id: string,
    datos: Partial<PlanEntrenamiento>,
  ): Promise<PlanEntrenamiento | null> {
    return await this.actualizarPlanUC.execute(id, datos);
  }

  // método fachada para eliminar un plan
  async eliminarPlan(id: string): Promise<boolean> {
    return await this.eliminarPlanUC.execute(id);
  }
}
