import { PlanRepository } from '../../Dominio/interfaces/plan/plan.repository.interface';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';

export class PlanMockRepository implements PlanRepository {
  private planes: PlanEntrenamiento[] = [];

  async create(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    const nuevo = { ...plan, id: 'plan-mock-' + Date.now() };
    this.planes.push(nuevo);
    return nuevo;
  }

  async getById(id: string): Promise<PlanEntrenamiento | null> {
    return this.planes.find((p) => p.id === id) || null;
  }

  async getByUsuarioId(idUsuario: string): Promise<PlanEntrenamiento[]> {
    return this.planes.filter((p) => p.id_usuario === idUsuario);
  }

  async update(id: string, datos: Partial<PlanEntrenamiento>): Promise<PlanEntrenamiento | null> {
    const index = this.planes.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.planes[index] = { ...this.planes[index], ...datos };
    return this.planes[index];
  }

  async delete(id: string): Promise<boolean> {
    const inicial = this.planes.length;
    this.planes = this.planes.filter((p) => p.id !== id);
    return this.planes.length < inicial;
  }
}
