import { Request, Response } from 'express';
import { SesionSchema } from '../schemas/sesion.schema';
import { SesionService } from '../../Aplicacion/services/sesion.service';

export class SesionController {
  // inyección del servicio fachada
  constructor(private readonly sesionService: SesionService) {}

  createSesion = async (req: Request, res: Response) => {
    // validación de estructura de datos entrantes
    const validacion = SesionSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // llamada al servicio para crear sesión
      const nueva = await this.sesionService.crearSesion(validacion.data);
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear la sesión' });
    }
  };

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // llamada al servicio para obtener por id
      const sesion = await this.sesionService.obtenerPorId(id);

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
      // llamada al servicio para obtener sesiones de un plan
      const sesiones = await this.sesionService.obtenerSesionesDelPlan(idPlan);
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
      // llamada al servicio para actualizar
      const actualizada = await this.sesionService.actualizarSesion(id, validacion.data);

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
      // llamada al servicio para eliminar
      const eliminada = await this.sesionService.eliminarSesion(id);

      if (!eliminada) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'sesión eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
