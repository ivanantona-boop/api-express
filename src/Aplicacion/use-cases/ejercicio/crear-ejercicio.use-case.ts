import { Ejercicio } from '../../../Dominio/models/ejercicio.model';
import { EjercicioRepository } from '../../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import NodeCache from 'node-cache';

export class CrearEjercicioUseCase {
  constructor(
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(datos: Ejercicio): Promise<Ejercicio> {
    // creación del ejercicio en la base de datos
    const nuevoEjercicio = await this.ejercicioRepository.create(datos);

    // invalidación de la caché para que el listado se actualice
    this.cache.del('ejercicios_all');

    return nuevoEjercicio;
  }
}
