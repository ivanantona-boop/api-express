import { Request, Response } from 'express';
import { SesionAppSchema } from '../schemas/sesion.schema';
import { SesionService } from '../../Aplicacion/services/sesion.service';
import { CrearSesionUseCase } from '../../Aplicacion/use-cases/sesion/crear-sesion.use-case';
import { SesionRepository } from '../../Dominio/interfaces/sesion/sesion.repository.interface';

export class SesionController {
  constructor(
    private readonly sesionService: SesionService,
    private readonly crearSesionUseCase: CrearSesionUseCase,
    private readonly sesionRepository: SesionRepository,
  ) {}

  // --- MÉTODO PRINCIPAL PARA CREAR DESDE APP ---
  createSesionApp = async (req: Request, res: Response) => {
    // 1. Validar con safeParse
    const validacion = SesionAppSchema.safeParse(req.body);

    // OPCIÓN B: Usar un bloque if/else explícito
    if (validacion.success) {
      // DENTRO de este bloque, TypeScript sabe que .data existe y es correcto
      const datos = validacion.data;

      try {
        const nueva = await this.crearSesionUseCase.executeDesdeApp(
          datos.idUsuario,
          datos.titulo,
          datos.fechaProgramada,
          datos.ejercicios,
        );
        return res.status(201).json(nueva);
      } catch (_error) {
        console.error('Error creando sesión:', _error);
        return res.status(500).json({ error: 'Error al procesar la sesión' });
      }
    } else {
      // Si no fue exitoso, devolvemos los errores de validación
      return res.status(400).json({ errores: validacion.error.issues });
    }
  };

  // --- GET HOY ---
  getSesionHoy = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params;
      const sesion = await this.sesionRepository.getSesionHoy(idUsuario);

      if (!sesion) {
        return res.status(404).json({ message: 'No hay entreno programado para hoy' });
      }
      return res.status(200).json(sesion);
    } catch (_error) {
      console.error(_error);
      return res.status(500).json({ error: 'Error de servidor' });
    }
  };

  // --- FINALIZAR ---
  finalizarSesion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const actualizada = await this.sesionRepository.update(id, { finalizada: true });
      if (!actualizada) return res.status(404).json({ message: 'Sesión no encontrada' });
      return res.status(200).json(actualizada);
    } catch (_error) {
      console.error(_error);
      return res.status(500).json({ error: 'Error al finalizar sesión' });
    }
  };

  // --- MÉTODOS CRUD ESTÁNDAR ---

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sesion = await this.sesionService.obtenerPorId(id);
      if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
      res.json(sesion);
    } catch (_error) {
      console.error(_error);
      res.status(500).json({ error: 'Error al obtener sesión' });
    }
  };

  getSesionesByPlan = async (req: Request, res: Response) => {
    try {
      const { idPlan } = req.params;
      const sesiones = await this.sesionService.obtenerSesionesDelPlan(idPlan);
      res.json(sesiones);
    } catch (_error) {
      console.error(_error);
      res.status(500).json({ error: 'Error interno' });
    }
  };

  updateSesion = async (req: Request, res: Response) => {
    const { id } = req.params;

    // 1. Validamos lo que viene de fuera (Formato App/JSON)
    const validacion = SesionAppSchema.partial().safeParse(req.body);

    if (validacion.success) {
      const datosInput = validacion.data;

      try {
        // 2. TRADUCCIÓN (Mapping): De Formato App -> Formato Dominio
        // Creamos un objeto que sí cumpla con Partial<SesionEntrenamiento>
        const datosParaActualizar: any = { ...datosInput };

        // Si vienen ejercicios, hay que traducir sus campos uno a uno
        if (datosInput.ejercicios) {
          datosParaActualizar.ejercicios = datosInput.ejercicios.map((ej) => ({
            // Aquí está la corrección del error en rojo:
            nombreEjercicio: ej.nombre, // La App manda 'nombre', BD quiere 'nombreEjercicio'
            series: ej.series,
            repeticiones: Number(ej.repeticiones), // Aseguramos que sea número
            peso: ej.peso,
            bloque: ej.bloque,
            observaciones: ej.observaciones, // La App manda 'observaciones', BD quiere 'observaciones'
          }));
        }

        // 3. Ahora sí, 'datosParaActualizar' tiene el formato correcto
        const actualizada = await this.sesionService.actualizarSesion(id, datosParaActualizar);

        if (!actualizada) return res.status(404).json({ error: 'No se pudo actualizar' });
        res.json(actualizada);
      } catch (_error) {
        console.error(_error);
        res.status(500).json({ error: 'Error al actualizar' });
      }
    } else {
      return res.status(400).json({ errores: validacion.error.issues });
    }
  };

  deleteSesion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eliminada = await this.sesionService.eliminarSesion(id);
      if (!eliminada) return res.status(404).json({ error: 'No se pudo eliminar' });
      res.json({ message: 'Sesión eliminada correctamente' });
    } catch (_error) {
      console.error(_error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
