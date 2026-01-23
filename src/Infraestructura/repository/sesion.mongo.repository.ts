import { SesionRepository } from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';
import { SesionModel } from '../models/SesionModel';

export class SesionMongoRepository implements SesionRepository {
  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    // Al guardar la sesión, como el esquema tiene 'ejercicios: [DetalleSchema]',
    // MongoDB guarda automáticamente todo el array de detalles embebido.
    const nueva = await SesionModel.create(sesion);
    return nueva.toObject();
  }

  async getById(id: string): Promise<SesionEntrenamiento | null> {
    // Aquí hacemos populate para ver los nombres de los ejercicios, no solo sus IDs
    return await SesionModel.findById(id).populate('ejercicios.id_ejercicio').lean();
  }

  async getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]> {
    return await SesionModel.find({ id_plan: idPlan }).lean();
  }

  async update(
    id: string,
    sesion: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
    return await SesionModel.findByIdAndUpdate(id, sesion, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const res = await SesionModel.findByIdAndDelete(id);
    return !!res;
  }
}
