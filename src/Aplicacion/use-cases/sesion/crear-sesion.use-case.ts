import { SesionEntrenamiento } from '../../../Dominio/models/sesion.model';
import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class CrearSesionUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    const nuevaSesion = await this.sesionRepository.create(sesion);
    // Usamos el operador ?. por si id_plan viene undefined
    if (sesion.id_plan) {
      this.cache.del(`sesiones_plan_${sesion.id_plan}`);
    }
    return nuevaSesion;
  }

  async executeDesdeApp(
    idUsuario: string,
    titulo: string,
    fechaString: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ejercicios: any[],
  ): Promise<SesionEntrenamiento> {
    const fecha = new Date(fechaString);

    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha inválida proporcionada desde la App');
    }

    // Aquí llamamos al repositorio usando la estructura exacta de 'SesionInputDTO'
    return await this.sesionRepository.crearDesdeApp({
      idUsuario,
      titulo,
      fechaProgramada: fecha.toISOString(),
      ejercicios: ejercicios.map((ej) => ({
        // CORREGIDO: Usamos los nombres de la interfaz (DTO), no los del modelo de dominio.
        nombre: ej.nombre,
        series: ej.series,
        repeticiones: ej.repeticiones, // Pasa string o number, tu interfaz lo acepta
        peso: ej.peso,
        bloque: ej.bloque,
        observaciones: ej.observaciones,
      })),
    });
  }
}
