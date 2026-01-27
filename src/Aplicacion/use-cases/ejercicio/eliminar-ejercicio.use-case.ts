import { EjercicioRepository } from '../../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import NodeCache from 'node-cache';

export class EliminarEjercicioUseCase {
  constructor(
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(id: string): Promise<boolean> {
    // eliminación del registro en la base de datos
    const eliminado = await this.ejercicioRepository.delete(id);

    // si se eliminó correctamente, invalidamos la caché
    if (eliminado) {
      this.cache.del('ejercicios_all');
    }

    return eliminado;
  }
}
