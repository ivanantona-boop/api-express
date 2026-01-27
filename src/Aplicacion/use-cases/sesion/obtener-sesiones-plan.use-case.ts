import { SesionEntrenamiento } from '../../../Dominio/models/sesion.model';
import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class ObtenerSesionesPlanUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(idPlan: string): Promise<SesionEntrenamiento[]> {
    const cacheKey = `sesiones_plan_${idPlan}`;

    // verificación de existencia en caché para optimizar la lectura
    const sesionesEnCache = this.cache.get<SesionEntrenamiento[]>(cacheKey);
    if (sesionesEnCache) {
      return sesionesEnCache;
    }

    // consulta al repositorio si los datos no están en memoria
    const sesiones = await this.sesionRepository.getByPlanId(idPlan);

    // almacenamiento en caché para futuras consultas
    this.cache.set(cacheKey, sesiones);

    return sesiones;
  }
}
