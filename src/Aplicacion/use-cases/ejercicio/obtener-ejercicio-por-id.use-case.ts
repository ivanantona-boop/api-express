import { Ejercicio } from '../../../Dominio/models/ejercicio.model';
import { EjercicioRepository } from '../../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';

export class ObtenerEjercicioPorIdUseCase {
  constructor(private readonly ejercicioRepository: EjercicioRepository) {}

  async execute(id: string): Promise<Ejercicio | null> {
    // llamada directa al repositorio para buscar por id
    return await this.ejercicioRepository.getById(id);
  }
}
