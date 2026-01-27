import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';
import NodeCache from 'node-cache';

export class EliminarPlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(id: string): Promise<boolean> {
    // recuperación previa del plan para identificar al usuario afectado
    const plan = await this.planRepository.getById(id);

    // eliminación física del registro
    const eliminado = await this.planRepository.delete(id);

    // invalidación de caché si el plan existía y fue eliminado
    if (eliminado && plan) {
      this.cache.del(`planes_user_${plan.id_usuario}`);
    }

    return eliminado;
  }
}
