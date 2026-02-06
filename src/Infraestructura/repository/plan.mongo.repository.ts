import { PlanRepository } from '../../Dominio/interfaces/plan/plan.repository.interface';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';
import { PlanModel } from '../models/PlanModel';

export class PlanMongoRepository implements PlanRepository {
  async create(plan: PlanEntrenamiento): Promise<PlanEntrenamiento> {
    const nuevo = await PlanModel.create(plan);
    // IMPORTANTE: Usamos el mapper para devolver un objeto limpio
    return this.mapToDomain(nuevo);
  }

  async getById(id: string): Promise<PlanEntrenamiento | null> {
    const doc = await PlanModel.findById(id).lean();

    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async getByUsuarioId(idUsuario: string): Promise<PlanEntrenamiento[]> {
    const docs = await PlanModel.find({ id_usuario: idUsuario }).lean();

    // Mapeamos el array entero
    return docs.map((d) => this.mapToDomain(d));
  }

  async update(id: string, plan: Partial<PlanEntrenamiento>): Promise<PlanEntrenamiento | null> {
    const doc = await PlanModel.findByIdAndUpdate(id, plan, { new: true }).lean();

    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async delete(id: string): Promise<boolean> {
    const res = await PlanModel.findByIdAndDelete(id);
    return !!res;
  }

  // --- EL TRADUCTOR (MAPPER) ---
  // Este método convierte un documento de MongoDB (con su _id y demás) a tu modelo de dominio limpio (PlanEntrenamiento)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDomain(mongoDoc: any): PlanEntrenamiento {
    return {
      // 1. ID del documento
      id: mongoDoc._id.toString(),

      // 2. Campos de datos exactos de tu Schema
      objetivo_principal: mongoDoc.objetivo_principal,
      fecha_inicio: mongoDoc.fecha_inicio,

      // 3. ID del usuario (convertido de ObjectId a String)
      id_usuario: mongoDoc.id_usuario ? mongoDoc.id_usuario.toString() : '',

      // 4. Timestamps (Mongoose los crea por ti porque pusiste timestamps: true)
      // Si tu modelo de Dominio (plan.model.ts) los tiene, descomenta estas líneas:
      // createdAt: mongoDoc.createdAt,
      // updatedAt: mongoDoc.updatedAt,
    } as PlanEntrenamiento;
  }
}
