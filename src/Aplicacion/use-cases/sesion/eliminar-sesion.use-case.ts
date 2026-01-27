import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class EliminarSesionUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(id: string): Promise<boolean> {
    // recuperación previa de la sesión para identificar el plan afectado
    const sesion = await this.sesionRepository.getById(id);

    // eliminación física del registro
    const eliminado = await this.sesionRepository.delete(id);

    // invalidación de caché si la sesión existía y fue eliminada
    if (eliminado && sesion) {
      this.cache.del(`sesiones_plan_${sesion.id_plan}`);
    }

    return eliminado;
  }
}
