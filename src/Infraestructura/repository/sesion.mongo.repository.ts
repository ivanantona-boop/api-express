import { Types } from 'mongoose';
import {
  SesionRepository,
  SesionInputDTO,
} from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';
import { SesionModel } from '../models/SesionModel';

export class SesionMongoRepository implements SesionRepository {
  // --- NUEVO MÉTODO: Para que el alumno vea su entreno de hoy ---
  async getSesionHoy(idUsuario: string): Promise<SesionEntrenamiento | null> {
    // Calculamos el inicio y fin del día actual
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);

    return (await SesionModel.findOne({
      id_usuario: idUsuario,
      fecha: {
        $gte: inicioHoy,
        $lte: finHoy,
      },
    })
      .populate('ejercicios.id_ejercicio')
      .lean()) as unknown as SesionEntrenamiento;
  }

  // --- MÉTODOS EXISTENTES ---

  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = await SesionModel.create(sesion);
    return (nueva as any).toObject() as unknown as SesionEntrenamiento;
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

  async crearDesdeApp(datos: SesionInputDTO): Promise<SesionEntrenamiento> {
    const idPlanDummy = '65c2b6e0e6c7a1a4f8f0e999';

    const ejerciciosMongoose = datos.ejercicios.map((ej) => {
      const idSimulado = new Types.ObjectId();

      const repsFinal =
        typeof ej.repeticiones === 'string' ? parseInt(ej.repeticiones) || 0 : ej.repeticiones;

      return {
        nombre: ej.nombre, // Antes tenías nombreEjercicio (Daba error)
        id_ejercicio: idSimulado as any,
        series: ej.series,
        repeticiones: repsFinal,
        peso: ej.peso || 0,
        observaciones: ej.observaciones, // Antes tenías notas (Daba error)
        bloque: ej.bloque || 0,
      };
    });

    const nuevaSesion = await SesionModel.create({
      titulo: datos.titulo,
      fecha: datos.fechaProgramada,
      finalizada: false,
      id_plan: idPlanDummy as any,
      id_usuario: datos.idUsuario as any,
      ejercicios: ejerciciosMongoose,
    } as any);

    return (nuevaSesion as any).toObject() as unknown as SesionEntrenamiento;
}
}
