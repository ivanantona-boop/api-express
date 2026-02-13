import { SesionEntrenamiento } from '../../../Dominio/models/sesion.model';
import { SesionRepository } from '../../../Dominio/interfaces/sesion/sesion.repository.interface';
import NodeCache from 'node-cache';

export class CrearSesionUseCase {
  constructor(
    private readonly sesionRepository: SesionRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(sesion: SesionEntrenamiento): Promise<SesionEntrenamiento> {
    // persistencia de la sesión en la base de datos
    const nuevaSesion = await this.sesionRepository.create(sesion);

    // invalidación de la caché asociada al plan para refrescar los datos
    this.cache.del(`sesiones_plan_${sesion.id_plan}`);

    return nuevaSesion;
  }
  // --- NUEVO MÉTODO: ESPECÍFICO PARA LA APP ANDROID ---
  // Este recibe los datos "sueltos" tal cual vienen del Controller
async executeDesdeApp(
    idUsuario: string,
    titulo: string,
    fechaString: string,
    ejercicios: any[],
  ): Promise<SesionEntrenamiento> {
    const fecha = new Date(fechaString);

    // Pasamos el DTO al repositorio
    return await this.sesionRepository.crearDesdeApp({
      idUsuario,
      titulo,
      fechaProgramada: fecha,
      ejercicios: ejercicios.map(ej => ({
        nombreEjercicio: ej.nombre, // Mapeamos 'nombre' (App) a 'nombreEjercicio' (Repositorio)
        series: ej.series,
        repeticiones: ej.repeticiones,
        peso: ej.peso,
        notas: ej.observaciones, // Mapeamos 'observaciones' (App) a 'notas' (Repositorio)
        bloque: ej.bloque
      })),
    });
  }
  // ------------------------------------------------------
}

