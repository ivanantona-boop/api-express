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
    // 1. Validación (Genera camelCase: objetivoPrincipal)
    const validacion = PlanSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    const datos = validacion.data;

    try {
      // Si no haces esto, a la base de datos le llegarán campos undefined

      const nuevo = await this.crearPlanUseCase.execute({
        objetivo_principal: datos.objetivoPrincipal,
        fecha_inicio: datos.fechaInicio,
        id_usuario: datos.idUsuario,
        // Si tu modelo tiene más campos, añádelos aquí
      } as any);

      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el plan' });
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

    // 1. Validación Parcial
    const validacion = PlanSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    const datos = validacion.data;

    try {
      // 2. TRADUCCIÓN DINÁMICA
      // Solo mapeamos los campos que hayan venido en la petición
      const datosParaActualizar: any = {};

      if (datos.objetivoPrincipal) datosParaActualizar.objetivo_principal = datos.objetivoPrincipal;
      if (datos.fechaInicio) datosParaActualizar.fecha_inicio = datos.fechaInicio;
      if (datos.idUsuario) datosParaActualizar.id_usuario = datos.idUsuario;

      const actualizado = await this.planService.actualizarPlan(id, datosParaActualizar);

      if (!actualizado) return res.status(404).json({ error: 'Plan no encontrado' });

      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar plan' });
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
