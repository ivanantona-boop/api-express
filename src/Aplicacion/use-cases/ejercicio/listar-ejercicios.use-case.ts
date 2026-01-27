import { Ejercicio } from '../../../Dominio/models/ejercicio.model';
import { EjercicioRepository } from '../../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import NodeCache from 'node-cache';

export class ListarEjerciciosUseCase {
  constructor(
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(): Promise<Ejercicio[]> {
    const cacheKey = 'ejercicios_all';

    // intento de recuperar datos de la memoria caché
    const datosEnCache = this.cache.get<Ejercicio[]>(cacheKey);
    if (datosEnCache) {
      return datosEnCache;
    }

    // si no hay caché, consulta al repositorio
    const ejercicios = await this.ejercicioRepository.getAll();

    // guardado en caché para futuras consultas
    this.cache.set(cacheKey, ejercicios);

    return ejercicios;
  }
}
