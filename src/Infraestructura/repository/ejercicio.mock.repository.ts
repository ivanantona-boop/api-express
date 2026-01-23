import { EjercicioRepository } from '../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';

export class EjercicioMockRepository implements EjercicioRepository {
  private ejercicios: Ejercicio[] = [];

  async create(ejercicio: Ejercicio): Promise<Ejercicio> {
    const nuevo = { ...ejercicio, id: 'mock-id-' + Date.now() };
    this.ejercicios.push(nuevo);
    return nuevo;
  }

  async getAll(): Promise<Ejercicio[]> {
    return this.ejercicios;
  }

  async getById(id: string): Promise<Ejercicio | null> {
    return this.ejercicios.find((e) => e.id === id) || null;
  }

  async delete(id: string): Promise<boolean> {
    const inicial = this.ejercicios.length;
    this.ejercicios = this.ejercicios.filter((e) => e.id !== id);
    return this.ejercicios.length < inicial;
  }
}
