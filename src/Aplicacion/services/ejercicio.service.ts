import { EjercicioRepository } from '../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';
import NodeCache from 'node-cache';

export class EjercicioService {
  private cache = new NodeCache({ stdTTL: 600 }); // 10 minutos de caché
  private readonly CACHE_KEY_ALL = 'ejercicios_all';

  constructor(private readonly ejercicioRepository: EjercicioRepository) {}

  async crearEjercicio(datos: Ejercicio): Promise<Ejercicio> {
    // Podrías validar aquí si el nombre ya existe antes de llamar al repo
    const nuevo = await this.ejercicioRepository.create(datos);
    this.cache.del(this.CACHE_KEY_ALL); // Invalidar caché
    return nuevo;
  }

  async obtenerTodos(): Promise<Ejercicio[]> {
    const enCache = this.cache.get<Ejercicio[]>(this.CACHE_KEY_ALL);
    if (enCache) return enCache;

    const ejercicios = await this.ejercicioRepository.getAll();
    this.cache.set(this.CACHE_KEY_ALL, ejercicios);
    return ejercicios;
  }

  async obtenerPorId(id: string): Promise<Ejercicio | null> {
    return await this.ejercicioRepository.getById(id);
  }

  async eliminarEjercicio(id: string): Promise<boolean> {
    const eliminado = await this.ejercicioRepository.delete(id);
    if (eliminado) this.cache.del(this.CACHE_KEY_ALL);
    return eliminado;
  }
}
