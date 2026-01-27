import { PlanEntrenamiento } from '../../../Dominio/models/plan.model';
import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';
import NodeCache from 'node-cache';

export class CrearPlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    // persistencia del plan en la base de datos
    const nuevoPlan = await this.planRepository.create(plan);

    // invalidación de la caché específica del usuario para forzar recarga
    this.cache.del(`planes_user_${plan.id_usuario}`);

    return nuevoPlan;
  }
}
