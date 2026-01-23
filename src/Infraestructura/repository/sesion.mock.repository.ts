import { SesionRepository } from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';

export class SesionMockRepository implements SesionRepository {
  private sesiones: SesionEntrenamiento[] = [];

  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = { ...sesion, id: 'sesion-mock-' + Date.now() };
    this.sesiones.push(nueva);
    return nueva;
  }

  async getById(id: string): Promise<SesionEntrenamiento | null> {
    return this.sesiones.find((s) => s.id === id) || null;
  }

  async getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]> {
    return this.sesiones.filter((s) => s.id_plan === idPlan);
  }

  async update(
    id: string,
    datos: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
    const index = this.sesiones.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sesiones[index] = { ...this.sesiones[index], ...datos };
    return this.sesiones[index];
  }

  async delete(id: string): Promise<boolean> {
    const inicial = this.sesiones.length;
    this.sesiones = this.sesiones.filter((s) => s.id !== id);
    return this.sesiones.length < inicial;
  }
}
