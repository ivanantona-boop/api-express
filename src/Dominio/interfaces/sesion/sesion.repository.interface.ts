import { SesionEntrenamiento } from '../../models/sesion.model';

// --- 1. NUEVO: Definimos el "paquete" de datos que llega desde la App Android ---
export interface SesionInputDTO {
  idUsuario: string; // String normal (no ObjectId todavía)
  titulo: string;
  // Aceptamos string o Date, porque el JSON viene como string
  fechaProgramada: Date | string;
  ejercicios: {
    nombreEjercicio: string; // Android manda el nombre, no el ID
    series: number;
    repeticiones: string | number; // Aceptamos string por si mandan rangos "10-12"
    peso: number;
    notas?: string;
  }[];
}

// --- 2. MODIFICADO: Añadimos el nuevo método al contrato ---
export interface SesionRepository {
  create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento>;
  getById(id: string): Promise<SesionEntrenamiento | null>;
  getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]>;
  update(id: string, sesion: Partial<SesionEntrenamiento>): Promise<SesionEntrenamiento | null>;
  delete(id: string): Promise<boolean>;

  // encargado de traducir DTO -> Modelo
  crearDesdeApp(datos: SesionInputDTO): Promise<SesionEntrenamiento>;
}
