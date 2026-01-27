import { PlanEntrenamiento } from '../../../Dominio/models/plan.model';
import { PlanRepository } from '../../../Dominio/interfaces/plan/plan.repository.interface';
import NodeCache from 'node-cache';

export class ObtenerPlanesUsuarioUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(idUsuario: string): Promise<PlanEntrenamiento[]> {
    const cacheKey = `planes_user_${idUsuario}`;

    // verificación de existencia en caché para retorno rápido
    const planesEnCache = this.cache.get<PlanEntrenamiento[]>(cacheKey);
    if (planesEnCache) {
      return planesEnCache;
    }

    // consulta a base de datos si no está en memoria
    const planes = await this.planRepository.getByUsuarioId(idUsuario);

    // almacenamiento en caché para futuras peticiones
    this.cache.set(cacheKey, planes);

    return planes;
  }
}
