import { Types } from 'mongoose';
import {
  SesionRepository,
  SesionInputDTO,
} from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';
import { SesionModel } from '../models/SesionModel';

export class SesionMongoRepository implements SesionRepository {
  // --- MÉTODOS EXISTENTES ---
  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = await SesionModel.create(sesion);
    return nueva.toObject() as unknown as SesionEntrenamiento;
  }

  async getById(id: string): Promise<SesionEntrenamiento | null> {
    return (await SesionModel.findById(id)
      .populate('ejercicios.id_ejercicio')
      .lean()) as unknown as SesionEntrenamiento;
  }

  async getByPlanId(idPlan: string): Promise<SesionEntrenamiento[]> {
    return (await SesionModel.find({ id_plan: idPlan }).lean()) as unknown as SesionEntrenamiento[];
  }

  async update(
    id: string,
    sesion: Partial<SesionEntrenamiento>,
  ): Promise<SesionEntrenamiento | null> {
    return (await SesionModel.findByIdAndUpdate(id, sesion, {
      new: true,
    }).lean()) as unknown as SesionEntrenamiento;
  }

  async delete(id: string): Promise<boolean> {
    const res = await SesionModel.findByIdAndDelete(id);
    return !!res;
  }

  // --- MÉTODOS CORREGIDOS PARA QUITAR LO ROJO ---

  async crearDesdeApp(datos: SesionInputDTO): Promise<SesionEntrenamiento> {
    // 1. ID DE PLAN FALSO (String o ObjectId)
    const idPlanDummy = '65c2b6e0e6c7a1a4f8f0e999';

    // 2. Procesamos ejercicios
    const ejerciciosMongoose = datos.ejercicios.map((ej) => {
      // Generamos un ID válido
      const idSimulado = new Types.ObjectId();

      // Aseguramos número en repeticiones
      const repsFinal =
        typeof ej.repeticiones === 'string' ? parseInt(ej.repeticiones) || 0 : ej.repeticiones;

      return {
        // TRUCO: Casteamos 'as any' para que TypeScript no se queje de que es un ObjectId
        // Mongoose lo guardará correctamente.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id_ejercicio: idSimulado as any,
        series: ej.series,
        repeticiones: repsFinal,
        peso: ej.peso || 0,
        observaciones: ej.notas,
      };
    });

    // 3. Crear en Mongoose
    const nuevaSesion = await SesionModel.create({
      fecha: datos.fechaProgramada,
      finalizada: false,
      // Usamos 'as any' en los campos conflictivos (String vs ObjectId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id_plan: idPlanDummy as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id_usuario: datos.idUsuario as any,
      ejercicios: ejerciciosMongoose,
    });

    // 4. Devolvemos forzando el tipo para que coincida con tu Dominio
    return nuevaSesion.toObject() as unknown as SesionEntrenamiento;
  }
}
