import { PlanEntrenamiento } from '../../models/plan.model';

export interface PlanRepository {
  create(plan: PlanEntrenamiento): Promise<PlanEntrenamiento>;
  getById(id: string): Promise<PlanEntrenamiento | null>;
  // Importante: Buscar todos los planes de un usuario concreto
  getByUsuarioId(idUsuario: string): Promise<PlanEntrenamiento[]>;
  update(id: string, plan: Partial<PlanEntrenamiento>): Promise<PlanEntrenamiento | null>;
  delete(id: string): Promise<boolean>;
}
