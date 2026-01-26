import { PlanRepository } from '../../Dominio/interfaces/plan/plan.repository.interface';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';
import NodeCache from 'node-cache';

export class PlanService {
  private cache = new NodeCache({ stdTTL: 300 }); // 5 minutos

  constructor(private readonly planRepository: PlanRepository) {}

  async crearPlan(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    // Aquí podrías validar que la fecha de inicio no sea en el pasado
    const nuevo = await this.planRepository.create(plan);
    // Invalidamos la caché de ESE usuario específico
    this.cache.del(`planes_user_${plan.id_usuario}`);
    return nuevo;
  }

  async obtenerPorId(id: string): Promise<PlanEntrenamiento | null> {
    return await this.planRepository.getById(id);
  }

  // Método clave para la APP: "Dame mis planes"
  async obtenerPlanesDeUsuario(idUsuario: string): Promise<PlanEntrenamiento[]> {
    const key = `planes_user_${idUsuario}`;
    const enCache = this.cache.get<PlanEntrenamiento[]>(key);

    if (enCache) return enCache;

    const planes = await this.planRepository.getByUsuarioId(idUsuario);
    this.cache.set(key, planes);
    return planes;
  }

  async actualizarPlan(
    id: string,
    datos: Partial<PlanEntrenamiento>,
  ): Promise<PlanEntrenamiento | null> {
    const actualizado = await this.planRepository.update(id, datos);
    if (actualizado) {
      this.cache.del(`planes_user_${actualizado.id_usuario}`);
    }
    return actualizado;
  }

  async eliminarPlan(id: string): Promise<boolean> {
    // Primero obtenemos el plan para saber de qué usuario borrar la caché
    const plan = await this.planRepository.getById(id);
    const eliminado = await this.planRepository.delete(id);

    if (eliminado && plan) {
      this.cache.del(`planes_user_${plan.id_usuario}`);
    }
    return eliminado;
  }
}
