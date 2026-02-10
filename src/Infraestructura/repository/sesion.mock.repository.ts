// 1. IMPORTANTE: Añade SesionInputDTO a los imports
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

  async getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]> {
    return this.sesiones.filter((s) => s.id_plan === idPlan);
  }

  async update(
    id: string,
    datos: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
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

  // --- 2. NUEVO MÉTODO AÑADIDO (El que faltaba) ---
  // Este método simula la creación desde la App para que el container no falle.
  async crearDesdeApp(datos: SesionInputDTO): Promise<SesionEntrenamiento> {
    // Simulamos la conversión de datos que hace el MongoRepository
    const nuevaSesionMock: SesionEntrenamiento = {
      id: 'sesion-app-mock-' + Date.now(), // Generamos ID falso
      fecha: datos.fechaProgramada,
      finalizada: false,
      id_plan: 'plan-dummy-mock', // Rellenamos el dato obligatorio que falta
      id_usuario: datos.idUsuario,
      ejercicios: datos.ejercicios.map((ej, index) => ({
        id_ejercicio: 'ejercicio-mock-' + index, // ID falso para el ejercicio
        series: ej.series,
        // Si viene string "10-12", cogemos 10. Si es número, se queda igual.
        repeticiones:
          typeof ej.repeticiones === 'string' ? parseInt(ej.repeticiones) || 0 : ej.repeticiones,
        peso: ej.peso || 0,
        observaciones: ej.notas,
      })),
    };

    // Guardamos en el array en memoria para que las pruebas funcionen
    this.sesiones.push(nuevaSesionMock);

    return nuevaSesionMock;
  }
}
