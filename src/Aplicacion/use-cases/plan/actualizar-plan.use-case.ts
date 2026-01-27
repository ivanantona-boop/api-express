import { PlanEntrenamiento } from '../../../Dominio/models/plan.model';
import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';
import NodeCache from 'node-cache';

export class ActualizarPlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(id: string, datos: Partial<PlanEntrenamiento>): Promise<PlanEntrenamiento | null> {
    // actualización de los datos en el repositorio
    const planActualizado = await this.planRepository.update(id, datos);

    // si la actualización es exitosa, se invalida la caché del usuario propietario
    if (planActualizado) {
      this.cache.del(`planes_user_${planActualizado.id_usuario}`);
    }

    return planActualizado;
  }
}
