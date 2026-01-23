import { Request, Response } from 'express';
import { PlanService } from '../../Aplicacion/services/plan.service';
import { PlanSchema } from '../schemas/plan.schema'; // 👈 Importamos esquema

export class PlanController {
  constructor(private readonly planService: PlanService) {}

  createPlan = async (req: Request, res: Response) => {
    // 1. Validación estricta para crear
    const validacion = PlanSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      const nuevo = await this.planService.crearPlan(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el plan' });
    }
  };

  getPlanById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await this.planService.obtenerPorId(id);
      if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener plan' });
    }
  };

  getPlanesByUsuario = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params;
      const planes = await this.planService.obtenerPlanesDeUsuario(idUsuario);
      res.json(planes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener planes del usuario' });
    }
  };

  updatePlan = async (req: Request, res: Response) => {
    const { id } = req.params;

    // 2. Validación PARCIAL para actualizar (Permite enviar solo campos sueltos)
    const validacion = PlanSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      const actualizado = await this.planService.actualizarPlan(id, validacion.data);
      if (!actualizado) return res.status(404).json({ error: 'No se pudo actualizar' });
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar' });
    }
  };

  deletePlan = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eliminado = await this.planService.eliminarPlan(id);
      if (!eliminado) return res.status(404).json({ error: 'No se pudo eliminar' });
      res.json({ message: 'Plan eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
