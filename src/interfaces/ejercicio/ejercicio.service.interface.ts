import { Ejercicio } from '../../models/ejercicio.model';
export interface EjercicioRepository {
   getAllEjercicios(): Promise<Ejercicio[]>;
    getEjercicioById(id: number): Promise<Ejercicio | null>;
    createEjercicio(ejercicio: Ejercicio): Promise<Ejercicio>;
    updateEjercicio(id: number, ejercicio: Ejercicio): Promise<Ejercicio | null>;
    deleteEjercicio(id: number): Promise<void>;
}
export interface EjercicioService {
    obtenerTodosLosEjercicios(): Promise<Ejercicio[]>;
    obtenerEjercicioPorId(id: number): Promise<Ejercicio | null>;
    creacionDeEjercicio(ejercicio: Ejercicio): Promise<Ejercicio>;
    actualizacionDeEjercicio(id: number, ejercicio: Ejercicio): Promise<Ejercicio | null>;
    eliminacionDeEjercicio(id: number): Promise<void>;
}