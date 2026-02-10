import { Request, Response } from 'express';
// 1. IMPORTANTE: Añade SesionAppSchema a la importación
import { SesionSchema, SesionAppSchema } from '../schemas/sesion.schema';
import { SesionService } from '../../Aplicacion/services/sesion.service';

export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  // Este método se queda igual (para uso interno o admin que manda datos completos)
  createSesion = async (req: Request, res: Response) => {
    const validacion = SesionSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      const nueva = await this.sesionService.crearSesion(validacion.data);
      res.status(201).json(nueva);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear la sesión' });
    }
  };

  // 2. NUEVO MÉTODO: Específico para recibir datos desde la App Android
  createSesionApp = async (req: Request, res: Response) => {
    console.log('API: Recibiendo petición de creación desde Android');

    // Validamos con el esquema flexible (SesionAppSchema) que permite Strings y falta de IDs
    const validacion = SesionAppSchema.safeParse(req.body);

    if (!validacion.success) {
      // Si falla, es útil ver por consola qué falló para depurar la App
      console.log('Error de validación:', JSON.stringify(validacion.error.issues, null, 2));
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // Llamamos al método nuevo del servicio (asegúrate de haberlo creado en SesionService)
      // Nota: 'validacion.data' aquí ya tiene los tipos correctos inferidos por Zod
      const nueva = await this.sesionService.crearDesdeApp(validacion.data);

      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error creando sesión desde App:', error);
      res.status(500).json({ error: 'error al crear la sesión desde la app' });
    }
  };

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
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
      const sesiones = await this.sesionService.obtenerSesionesDelPlan(idPlan);
      res.json(sesiones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener sesiones del plan' });
    }
  };

  updateSesion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const validacion = SesionSchema.partial().safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
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
      const eliminada = await this.sesionService.eliminarSesion(id);

      if (!eliminada) return res.status(404).json({ error: 'no se pudo eliminar' });
      res.json({ message: 'sesión eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
