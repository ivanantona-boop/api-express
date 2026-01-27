import { Request, Response } from 'express';
import { SesionSchema } from '../schemas/sesion.schema';

// importación de casos de uso
import { CrearSesionUseCase } from '../../Aplicacion/use-cases/sesion/crear-sesion.use-case';
import { ObtenerSesionPorIdUseCase } from '../../Aplicacion/use-cases/sesion/obtener-sesion-por-id.use-case';
import { ObtenerSesionesPlanUseCase } from '../../Aplicacion/use-cases/sesion/obtener-sesiones-plan.use-case';
import { ActualizarSesionUseCase } from '../../Aplicacion/use-cases/sesion/actualizar-sesion.use-case';
import { EliminarSesionUseCase } from '../../Aplicacion/use-cases/sesion/eliminar-sesion.use-case';

export class SesionController {
  // inyección de dependencias de todos los casos de uso necesarios
  constructor(
    private readonly crearSesionUseCase: CrearSesionUseCase,
    private readonly obtenerSesionPorIdUseCase: ObtenerSesionPorIdUseCase,
    private readonly obtenerSesionesPlanUseCase: ObtenerSesionesPlanUseCase,
    private readonly actualizarSesionUseCase: ActualizarSesionUseCase,
    private readonly eliminarSesionUseCase: EliminarSesionUseCase,
  ) {}

  createSesion = async (req: Request, res: Response) => {
    // validación de estructura de datos entrantes
    const validacion = SesionSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // ejecución del caso de uso de creación
      const nueva = await this.crearSesionUseCase.execute(validacion.data);
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear la sesión' });
    }
  };

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // ejecución del caso de uso de recuperación por id
      const sesion = await this.obtenerSesionPorIdUseCase.execute(id);

      if (!sesion) return res.status(404).json({ error: 'sesión no encontrada' });
      res.json(sesion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener sesión' });
    }
  };

  getSesionesByPlan = async (req: Request, res: Response) => {
    try {
      const { idPlan } = req.params;
      // ejecución del caso de uso de listado con caché
      const sesiones = await this.obtenerSesionesPlanUseCase.execute(idPlan);
      res.json(sesiones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener sesiones del plan' });
    }
  };

  updateSesion = async (req: Request, res: Response) => {
    const { id } = req.params;

    // validación parcial para actualizaciones puntuales
    const validacion = SesionSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // ejecución del caso de uso de actualización
      const actualizada = await this.actualizarSesionUseCase.execute(id, validacion.data);

      if (!actualizada) return res.status(404).json({ error: 'no se pudo actualizar' });
      res.json(actualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al actualizar' });
    }
  };

  deleteSesion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // ejecución del caso de uso de eliminación
      const eliminada = await this.eliminarSesionUseCase.execute(id);

      if (!eliminada) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'sesión eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
