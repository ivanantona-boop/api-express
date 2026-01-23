import { PlanRepository } from '../../Dominio/interfaces/plan/plan.repository.interface';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';
import { PlanModel } from '../models/PlanModel';

export class PlanMongoRepository implements PlanRepository {
  async create(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    const nuevo = await PlanModel.create(plan);
    // Populamos (cargamos datos) del usuario si fuera necesario, o devolvemos plano
    return nuevo.toObject();
  }

  async getById(id: string): Promise<PlanEntrenamiento | null> {
    // .populate('id_usuario') nos traería los datos del usuario automáticamente
    return await PlanModel.findById(id).lean();
  }

  async getByUsuarioId(idUsuario: string): Promise<PlanEntrenamiento[]> {
    // SELECT * FROM Planes WHERE id_usuario = ...
    return await PlanModel.find({ id_usuario: idUsuario }).lean();
  }

  async update(id: string, plan: Partial<PlanEntrenamiento>): Promise<PlanEntrenamiento | null> {
    return await PlanModel.findByIdAndUpdate(id, plan, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const res = await PlanModel.findByIdAndDelete(id);
    return !!res;
  }
}
