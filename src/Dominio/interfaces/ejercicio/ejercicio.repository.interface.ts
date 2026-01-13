import { Ejercicio } from '../../models/ejercicio.model';
export interface EjercicioRepository {
    getAll(): Promise<Ejercicio[]>;
    getById(id: number): Promise<Ejercicio | null>;
    create(ejercicio: Ejercicio): Promise<Ejercicio>;
    update(id: number, ejercicio: Ejercicio): Promise<Ejercicio | null>;
    delete(id: number): Promise<void>;
}
