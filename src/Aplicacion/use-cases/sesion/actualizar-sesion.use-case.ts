import { SesionEntrenamiento } from '../../../Dominio/models/sesion.model';
import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class ActualizarSesionUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(
    id: string,
    datos: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
    // actualización de los datos en el repositorio
    const sesionActualizada = await this.sesionRepository.update(id, datos);

    // si la actualización es exitosa, invalidamos la caché del plan correspondiente
    if (sesionActualizada) {
      this.cache.del(`sesiones_plan_${sesionActualizada.id_plan}`);
    }

    return sesionActualizada;
  }
}
