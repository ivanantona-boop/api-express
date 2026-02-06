import { PlanEntrenamiento } from '../../../Dominio/models/plan.model';
import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';
import NodeCache from 'node-cache';

export class ObtenerPlanActualUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(idUsuario: string): Promise<PlanEntrenamiento | null> {
    const cacheKey = `planes_user_${idUsuario}`;

    // 1. Intentar leer de caché
    const cached = this.cache.get<PlanEntrenamiento[]>(cacheKey);
    if (cached) {
      // Devolvemos el último del array cacheado
      return cached[cached.length - 1] || null;
    }

    // 2. Si no hay caché, buscar en DB
    const planes = await this.planRepository.getByUsuarioId(idUsuario);

    if (!planes || planes.length === 0) return null;

    // 3. Guardar en caché para la próxima
    this.cache.set(cacheKey, planes);

    return planes[planes.length - 1];
  }
}
