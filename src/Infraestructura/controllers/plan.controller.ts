import { Request, Response } from 'express';
import { PlanSchema } from '../schemas/plan.schema';
import { PlanService } from '../../Aplicacion/services/plan.service';

// --- IMPORTS AÑADIDOS (Necesarios para que el constructor funcione) ---
import { CrearPlanUseCase } from '../../Aplicacion/use-cases/plan/crear-plan.use-case';
import { ObtenerPlanActualUseCase } from '../../Aplicacion/use-cases/plan/obtener-plan-actual.use-case';

export class PlanController {
  // inyección de dependencias
  constructor(
    private readonly planService: PlanService,
    private readonly crearPlanUseCase: CrearPlanUseCase,
    private readonly obtenerPlanActualUseCase: ObtenerPlanActualUseCase,
  ) {}

  // --- REFACTORIZADO: USA EL CASO DE USO ---
  createPlan = async (req: Request, res: Response) => {
    // validación estricta de datos entrantes con Zod
    const validacion = PlanSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // CAMBIO CLAVE: Usamos el Caso de Uso (que gestiona la caché y la creación)
      // Usamos 'as any' para compatibilidad entre el tipo Zod y el Modelo de Dominio
      const nuevo = await this.crearPlanUseCase.execute(validacion.data as any);

      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear el plan' });
    }
  };

  // --- NUEVO MÉTODO: OBTENER PLAN ACTUAL ---
  // Este método faltaba y es necesario para usar ObtenerPlanActualUseCase
  getPlanActual = async (req: Request, res: Response) => {
    try {
      // Suponemos que el id viene por query param: ?usuario=XXX
      const idUsuario = req.query.usuario as string;

      if (!idUsuario) {
        return res.status(400).json({ error: 'Falta el parámetro usuario' });
      }

      const plan = await this.obtenerPlanActualUseCase.execute(idUsuario);

      if (!plan) {
        return res.status(404).json({ error: 'El usuario no tiene un plan activo' });
      }

      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener plan actual' });
    }
  };

  // --- MÉTODOS LEGACY (Siguen usando el Service por ahora) ---

  getPlanById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
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
      const planes = await this.planService.obtenerPlanesDeUsuario(idUsuario);
      res.json(planes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener planes del usuario' });
    }
  };

  updatePlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const validacion = PlanSchema.partial().safeParse(req.body);
    if (!validacion.success) return res.status(400).json({ errores: validacion.error.issues });

    try {
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
      const eliminado = await this.planService.eliminarPlan(id);
      if (!eliminado) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'plan eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
