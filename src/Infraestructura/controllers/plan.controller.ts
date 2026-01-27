import { Request, Response } from 'express';
import { PlanSchema } from '../schemas/plan.schema';

// importación de casos de uso
import { CrearPlanUseCase } from '../../Aplicacion/use-cases/plan/crear-plan.use-case';
import { ObtenerPlanPorIdUseCase } from '../../Aplicacion/use-cases/plan/obtener-plan-por-id.use-case';
import { ObtenerPlanesUsuarioUseCase } from '../../Aplicacion/use-cases/plan/obtener-planes-usuario.use-case';
import { ActualizarPlanUseCase } from '../../Aplicacion/use-cases/plan/actualizar-plan.use-case';
import { EliminarPlanUseCase } from '../../Aplicacion/use-cases/plan/eliminar-plan.use-case';

export class PlanController {
  // inyección de dependencias de todos los casos de uso necesarios
  constructor(
    private readonly crearPlanUseCase: CrearPlanUseCase,
    private readonly obtenerPlanPorIdUseCase: ObtenerPlanPorIdUseCase,
    private readonly obtenerPlanesUsuarioUseCase: ObtenerPlanesUsuarioUseCase,
    private readonly actualizarPlanUseCase: ActualizarPlanUseCase,
    private readonly eliminarPlanUseCase: EliminarPlanUseCase,
  ) {}

  createPlan = async (req: Request, res: Response) => {
    // validación estricta de datos entrantes
    const validacion = PlanSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // ejecución del caso de uso de creación
      const nuevo = await this.crearPlanUseCase.execute(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear el plan' });
    }
  };

  getPlanById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // ejecución del caso de uso de recuperación por id
      const plan = await this.obtenerPlanPorIdUseCase.execute(id);

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
      // ejecución del caso de uso de listado con caché
      const planes = await this.obtenerPlanesUsuarioUseCase.execute(idUsuario);
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
      // ejecución del caso de uso de actualización
      const actualizado = await this.actualizarPlanUseCase.execute(id, validacion.data);

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
      // ejecución del caso de uso de eliminación
      const eliminado = await this.eliminarPlanUseCase.execute(id);

      if (!eliminado) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'plan eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
