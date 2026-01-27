import { PlanEntrenamiento } from '../../../Dominio/models/plan.model';
import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';

export class ObtenerPlanPorIdUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(id: string): Promise<PlanEntrenamiento | null> {
    // recuperación directa del plan por su identificador único
    return await this.planRepository.getById(id);
  }
}
