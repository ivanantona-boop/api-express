import { SesionRepository } from '../../Dominio/interfaces/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';
import NodeCache from 'node-cache';

export class SesionService {
  // Las sesiones cambian mucho (se marcan checks, se editan pesos),
  // ponemos un TTL (Tiempo de vida) bajo.
  private cache = new NodeCache({ stdTTL: 60 });

  constructor(private readonly sesionRepository: SesionRepository) {}

  async crearSesion(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = await this.sesionRepository.create(sesion);
    this.cache.del(`sesiones_plan_${sesion.id_plan}`);
    return nueva;
  }

  async obtenerPorId(id: string): Promise<SesionEntrenamiento | null> {
    return await this.sesionRepository.getById(id);
  }

  // Método clave para la APP: "Cargar rutina de hoy"
  async obtenerSesionesDelPlan(idPlan: string): Promise<SesionEntrenamiento[]> {
    const key = `sesiones_plan_${idPlan}`;
    const enCache = this.cache.get<SesionEntrenamiento[]>(key);

    if (enCache) return enCache;

    const sesiones = await this.sesionRepository.getByPlanId(idPlan);
    this.cache.set(key, sesiones);
    return sesiones;
  }

  async actualizarSesion(
    id: string,
    datos: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
    const actualizada = await this.sesionRepository.update(id, datos);
    if (actualizada) {
      this.cache.del(`sesiones_plan_${actualizada.id_plan}`);
    }
    return actualizada;
  }

  async eliminarSesion(id: string): Promise<boolean> {
    const sesion = await this.sesionRepository.getById(id);
    const eliminado = await this.sesionRepository.delete(id);

    if (eliminado && sesion) {
      this.cache.del(`sesiones_plan_${sesion.id_plan}`);
    }
    return eliminado;
  }
}
