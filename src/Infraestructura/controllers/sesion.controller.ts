import { Request, Response } from 'express';
import { SesionSchema, SesionAppSchema } from '../schemas/sesion.schema';
import { SesionService } from '../../Aplicacion/services/sesion.service';
import { CrearSesionUseCase } from '../../Aplicacion/use-cases/sesion/crear-sesion.use-case';
import { SesionRepository } from '../../Dominio/interfaces/sesion/sesion.repository.interface';
import { z } from 'zod';

// Definimos el tipo basado en el esquema para que el IDE no se pierda
type SesionAppInput = z.infer<typeof SesionAppSchema>;

export class SesionController {
  constructor(
    private readonly sesionService: SesionService,
    private readonly crearSesionUseCase: CrearSesionUseCase,
    private readonly sesionRepository: SesionRepository,
  ) {}

  createSesionApp = async (req: Request, res: Response) => {
    // 1. Validamos
    const validacion = SesionAppSchema.safeParse(req.body);

    // 2. Si falla, devolvemos error y cortamos ejecución
    if (!validacion.success) {
      return res.status(400).json({ errores: validacion.error.issues });
    }

    // 3. Forzamos el tipo de los datos validados
    // Esto quita el "rojo" sí o sí
    const datos = validacion.data as SesionAppInput;

    try {
      // Usamos los nombres que tienes en tu SesionAppSchema:
      // idUsuario, titulo, fechaProgramada, ejercicios
      const nueva = await this.crearSesionUseCase.executeDesdeApp(
        datos.idUsuario,
        datos.titulo,
        datos.fechaProgramada,
        datos.ejercicios // Aquí van nombreEjercicio, series, repeticiones...
      );

      return res.status(201).json(nueva);
    } catch (error) {
      console.error('Error en Use Case:', error);
      return res.status(500).json({ error: 'error al procesar la sesión' });
    }
  };

  // --- GET HOY ---
  getSesionHoy = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params;
      const sesion = await this.sesionRepository.getSesionHoy(idUsuario);
      if (!sesion) return res.status(404).json({ message: 'No hay entreno hoy' });
      return res.status(200).json(sesion);
    } catch (error) {
      return res.status(500).json({ error: 'Error de servidor' });
    }
  };

  // --- FINALIZAR ---
  finalizarSesion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const actualizada = await this.sesionRepository.update(id, { finalizada: true });
      if (!actualizada) return res.status(404).json({ message: 'No encontrada' });
      return res.status(200).json(actualizada);
    } catch (error) {
      return res.status(500).json({ error: 'Error al finalizar' });
    }
  };
  // --- RESTO DE MÉTODOS ---
  createSesion = async (req: Request, res: Response) => {
    // 1. Validamos la entrada
    const validacion = SesionAppSchema.safeParse(req.body);

    // 2. Si falla, devolvemos 400 con los detalles
    if (!validacion.success) {
      console.log('Zod Error:', validacion.error.format());
      return res.status(400).json({ errores: validacion.error.issues });
    }

    // 3. EXTRAEMOS LOS DATOS (Aquí ya no saldrá en rojo)
    // TypeScript ya sabe que si llegamos aquí, 'success' es true.
    const { idUsuario, titulo, fechaProgramada, ejercicios } = validacion.data;

    try {
      // Llamamos al Caso de Uso
      const nueva = await this.crearSesionUseCase.executeDesdeApp(
        idUsuario,
        titulo,
        fechaProgramada,
        ejercicios
      );

      return res.status(201).json(nueva);
    } catch (error) {
      console.error('Error en Use Case:', error);
      return res.status(500).json({ error: 'error interno al crear sesión' });
    }
  };

  getSesionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sesion = await this.sesionService.obtenerPorId(id);
      if (!sesion) return res.status(404).json({ error: 'sesión no encontrada' });
      res.json(sesion);
    } catch (error) {
      res.status(500).json({ error: 'error al obtener sesión' });
    }
  };

  getSesionesByPlan = async (req: Request, res: Response) => {
    try {
      const { idPlan } = req.params;
      const sesiones = await this.sesionService.obtenerSesionesDelPlan(idPlan);
      res.json(sesiones);
    } catch (error) {
      res.status(500).json({ error: 'error al obtener sesiones del plan' });
    }
  };

  updateSesion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const validacion = SesionSchema.partial().safeParse(req.body);
    if (!validacion.success) return res.status(400).json({ errores: validacion.error.issues });
    try {
      const actualizada = await this.sesionService.actualizarSesion(id, validacion.data);
      if (!actualizada) return res.status(404).json({ error: 'no se pudo actualizar' });
      res.json(actualizada);
    } catch (error) {
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
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
} 