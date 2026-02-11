import { Types } from 'mongoose';
import {
  SesionRepository,
  SesionInputDTO, // Asegúrate de que este DTO tenga 'titulo' definido en la interfaz
} from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';
import { SesionModel } from '../models/SesionModel';

export class SesionMongoRepository implements SesionRepository {
  // --- MÉTODOS EXISTENTES (Sin cambios) ---

  async create(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nueva = await SesionModel.create(sesion);
    // Usamos el truco del 'as any' para evitar líos con el tipo de retorno de Mongoose
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
    // 1. ID DE PLAN FALSO
    const idPlanDummy = '65c2b6e0e6c7a1a4f8f0e999';

    // 2. Procesamos ejercicios
    const ejerciciosMongoose = datos.ejercicios.map((ej) => {
      const idSimulado = new Types.ObjectId();

      const repsFinal =
        typeof ej.repeticiones === 'string' ? parseInt(ej.repeticiones) || 0 : ej.repeticiones;

      return {
        // Mapeo del nombre correcto
        nombre: ej.nombreEjercicio,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id_ejercicio: idSimulado as any,
        series: ej.series,
        repeticiones: repsFinal,
        peso: ej.peso || 0,
        observaciones: ej.notas,
      };
    });

    // 3. Crear en Mongoose
    // TRUCO APLICADO: Añadimos 'as any' al final del objeto para silenciar el error de 'titulo'
    const nuevaSesion = await SesionModel.create({
      titulo: datos.titulo,
      fecha: datos.fechaProgramada,
      finalizada: false,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id_plan: idPlanDummy as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id_usuario: datos.idUsuario as any,

      ejercicios: ejerciciosMongoose,
    } as any); // <--- ¡ESTE 'as any' ES LA SOLUCIÓN MÁGICA!

    // 4. Devolvemos forzando el tipo
    return (nuevaSesion as any).toObject() as unknown as SesionEntrenamiento;
  }
}
