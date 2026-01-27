import { Request, Response } from 'express';
import { PlanSchema } from '../schemas/plan.schema';
import { PlanService } from '../../Aplicacion/services/plan.service';

export class PlanController {
  // inyección del servicio fachada
  constructor(private readonly planService: PlanService) {}

  createPlan = async (req: Request, res: Response) => {
    // validación estricta de datos entrantes
    const validacion = PlanSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // llamada al servicio para crear plan
      const nuevo = await this.planService.crearPlan(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear el plan' });
    }
  };

  getPlanById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // llamada al servicio para obtener por id
      const plan = await this.planService.obtenerPorId(id);

      if (!plan) return res.status(404).json({ error: 'plan no encontrado' });
      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener plan' });
    }
  };

  getPlanesByUsuario = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params;
      // llamada al servicio para obtener planes de un usuario
      const planes = await this.planService.obtenerPlanesDeUsuario(idUsuario);
      res.json(planes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener planes del usuario' });
    }
  };

  updatePlan = async (req: Request, res: Response) => {
    const { id } = req.params;

    // validación parcial para permitir actualización de campos específicos
    const validacion = PlanSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // llamada al servicio para actualizar
      const actualizado = await this.planService.actualizarPlan(id, validacion.data);

      if (!actualizado) return res.status(404).json({ error: 'no se pudo actualizar' });
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al actualizar' });
    }
  };

  deletePlan = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // llamada al servicio para eliminar
      const eliminado = await this.planService.eliminarPlan(id);

      if (!eliminado) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'plan eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
