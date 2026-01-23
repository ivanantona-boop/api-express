import { SesionEntrenamiento } from '../../models/sesion.model';

export interface SesionRepository {
  create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento>;
  getById(id: string): Promise<SesionEntrenamiento | null>;
  // Buscar sesiones por Plan (ej: Todas las del mes)
  getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]>;
  update(id: string, sesion: Partial<SesionEntrenamiento>): Promise<SesionEntrenamiento | null>;
  delete(id: string): Promise<boolean>;
}
