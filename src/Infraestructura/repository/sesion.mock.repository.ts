import {
  SesionRepository,
  SesionInputDTO,
} from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';

export class SesionMockRepository implements SesionRepository {
  private sesiones: SesionEntrenamiento[] = [];

  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = { ...sesion, id: 'sesion-mock-' + Date.now() };
    this.sesiones.push(nueva);
    return nueva;
  }

  async getById(id: string): Promise<SesionEntrenamiento | null> {
    return this.sesiones.find((s) => s.id === id) || null;
  }

  async getSesionHoy(idUsuario: string): Promise<SesionEntrenamiento | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.sesiones.find((s) => 
      s.id_usuario === idUsuario && 
      new Date(s.fecha).toISOString().split('T')[0] === today
    ) || null;
  }

  async getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]> {
    return this.sesiones.filter((s) => s.id_plan === idPlan);
  }

  async update(id: string, datos: Partial<SesionEntrenamiento>): Promise<SesionEntrenamiento | null> {
    const index = this.sesiones.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.sesiones[index] = { ...this.sesiones[index], ...datos };
    return this.sesiones[index];
  }

  async delete(id: string): Promise<boolean> {
    const inicial = this.sesiones.length;
    this.sesiones = this.sesiones.filter((s) => s.id !== id);
    return this.sesiones.length < inicial;
  }

  async crearDesdeApp(datos: SesionInputDTO): Promise<SesionEntrenamiento> {
    const nuevaSesionMock: SesionEntrenamiento = {
      id: 'sesion-app-mock-' + Date.now(),
      fecha: new Date(datos.fechaProgramada),
      titulo: datos.titulo,
      finalizada: false,
      id_plan: 'plan-dummy-mock',
      id_usuario: datos.idUsuario,
      ejercicios: datos.ejercicios.map((ej, index) => ({
        nombre: ej.nombre,
        id_ejercicio: 'ejercicio-mock-' + index,
        series: ej.series,
        repeticiones: typeof ej.repeticiones === 'string' ? parseInt(ej.repeticiones) || 0 : ej.repeticiones,
        peso: ej.peso || 0,
        observaciones: ej.observaciones,
        bloque: ej.bloque || 0
      })),
    };
    this.sesiones.push(nuevaSesionMock);
    return nuevaSesionMock;
  }
}