import { EjercicioRepository } from '../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';
import { EjercicioModel } from '../models/EjercicioModel';

export class EjercicioMongoRepository implements EjercicioRepository {
  async create(ejercicio: Ejercicio): Promise<Ejercicio> {
    const nuevo = await EjercicioModel.create(ejercicio);
    return nuevo.toObject(); // Convertimos documento Mongo a Objeto JS limpio
  }

  async getAll(): Promise<Ejercicio[]> {
    return await EjercicioModel.find().lean(); // .lean() es más rápido para lectura
  }

  async getById(id: string): Promise<Ejercicio | null> {
    return await EjercicioModel.findById(id).lean();
  }

  async delete(id: string): Promise<boolean> {
    const resultado = await EjercicioModel.findByIdAndDelete(id);
    return !!resultado; // Devuelve true si existía y lo borró
  }
}
