import { Request, Response } from 'express';
import { SesionSchema, SesionAppSchema } from '../schemas/sesion.schema';
import { SesionService } from '../../Aplicacion/services/sesion.service';
// 1. IMPORTANTE: Importamos el Caso de Uso
import { CrearSesionUseCase } from '../../Aplicacion/use-cases/sesion/crear-sesion.use-case';

export class SesionController {
  constructor(
    private readonly sesionService: SesionService,
    // 2. MODIFICADO: Inyectamos el Caso de Uso aquí (el container.ts te lo pasará)
    private readonly crearSesionUseCase: CrearSesionUseCase,
  ) {}

  // Este método se queda igual (usa el servicio para lógica estándar)
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

  // 3. MODIFICADO: Usamos el Caso de Uso en lugar del Servicio
  createSesionApp = async (req: Request, res: Response) => {
    console.log('API: Recibiendo petición de creación desde Android');

    const validacion = SesionAppSchema.safeParse(req.body);

    if (!validacion.success) {
      console.log('Error de validación:', JSON.stringify(validacion.error.issues, null, 2));
      return res.status(400).json({ errores: validacion.error.issues });
    }

    try {
      // Extraemos los datos validados por Zod
      const { idUsuario, titulo, fechaProgramada, ejercicios } = validacion.data;

      // CAMBIO CLAVE: Llamamos al Caso de Uso.
      // Le pasamos los argumentos desglosados tal como los definimos en 'executeDesdeApp'
      const nueva = await this.crearSesionUseCase.executeDesdeApp(
        idUsuario,
        titulo,
        fechaProgramada, // Zod nos asegura que esto es un string aquí
        ejercicios,
      );

      res.status(201).json(nueva);
    } catch (error) {
      console.error('Error creando sesión desde App:', error);
      res.status(500).json({ error: 'error al crear la sesión desde la app' });
    }
  };

  // ... El resto de métodos (get, update, delete) se quedan IGUAL, usando sesionService ...
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
