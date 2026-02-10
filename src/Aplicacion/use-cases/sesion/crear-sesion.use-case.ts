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
    // 1. Convertimos la fecha de String (que manda Android) a Date real
    const fecha = new Date(fechaString);

    // 2. Llamamos al método "traductor" del repositorio (crearDesdeApp)
    // Fíjate que aquí NO llamamos a 'create', sino a 'crearDesdeApp'
    const nuevaSesion = await this.sesionRepository.crearDesdeApp({
      idUsuario,
      titulo,
      fechaProgramada: fecha,
      ejercicios,
    });

    // 3. Mantenemos tu lógica de caché
    // Aunque el plan sea "dummy", es bueno limpiar por si acaso
    this.cache.del(`sesiones_plan_${nuevaSesion.id_plan}`);

    return nuevaSesion;
  }
}
