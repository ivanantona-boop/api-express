import { SesionEntrenamiento } from '../../../Dominio/models/sesion.model';
import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class CrearSesionUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    // persistencia de la sesión en la base de datos
    const nuevaSesion = await this.sesionRepository.create(sesion);

    // invalidación de la caché asociada al plan para refrescar los datos
    this.cache.del(`sesiones_plan_${sesion.id_plan}`);

    return nuevaSesion;
  }
}
