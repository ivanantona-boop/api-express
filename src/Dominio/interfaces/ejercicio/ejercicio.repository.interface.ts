import { Ejercicio } from '../../models/ejercicio.model';

export interface EjercicioRepository {
  create(ejercicio: Ejercicio): Promise<Ejercicio>;
  getAll(): Promise<Ejercicio[]>;
  getById(id: string): Promise<Ejercicio | null>;
  delete(id: string): Promise<boolean>;
}
