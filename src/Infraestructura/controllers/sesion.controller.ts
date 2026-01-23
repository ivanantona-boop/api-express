import { Request, Response } from 'express';
import { SesionService } from '../../Aplicacion/services/sesion.service';
import { SesionSchema } from '../schemas/sesion.schema';

export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  createSesion = async (req: Request, res: Response) => {
    // 1. Valida que venga id_plan, id_usuario y el array de ejercicios bien formado
    const validacion = SesionSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      const nueva = await this.sesionService.crearSesion(validacion.data);
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la sesión' });
    }
  };

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sesion = await this.sesionService.obtenerPorId(id);
      if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
      res.json(sesion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener sesión' });
    }
  };

  getSesionesByPlan = async (req: Request, res: Response) => {
    try {
      const { idPlan } = req.params;
      const sesiones = await this.sesionService.obtenerSesionesDelPlan(idPlan);
      res.json(sesiones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener sesiones del plan' });
    }
  };

  updateSesion = async (req: Request, res: Response) => {
    const { id } = req.params;

    // 2. Validación PARCIAL (útil para marcar solo "finalizada: true")
    const validacion = SesionSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      const actualizada = await this.sesionService.actualizarSesion(id, validacion.data);
      if (!actualizada) return res.status(404).json({ error: 'No se pudo actualizar' });
      res.json(actualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar' });
    }
  };

  deleteSesion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eliminada = await this.sesionService.eliminarSesion(id);
      if (!eliminada) return res.status(404).json({ error: 'No se pudo eliminar' });
      res.json({ message: 'Sesión eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
