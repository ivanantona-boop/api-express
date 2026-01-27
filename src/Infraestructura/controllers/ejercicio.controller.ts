import { Request, Response } from 'express';
import { EjercicioSchema } from '../schemas/ejercicio.schema';
import { EjercicioService } from '../../Aplicacion/services/ejercicio.service';

export class EjercicioController {
  // inyección del servicio fachada
  constructor(private readonly ejercicioService: EjercicioService) {}

  createEjercicio = async (req: Request, res: Response) => {
    // validación de entrada con zod
    const validacion = EjercicioSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({
        mensaje: 'datos inválidos',
        errores: validacion.error.issues,
      });
    }

    try {
      // llamada al servicio para crear ejercicio
      const nuevo = await this.ejercicioService.crearEjercicio(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear ejercicio' });
    }
  };

  getEjercicios = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para listar ejercicios
      const lista = await this.ejercicioService.obtenerTodos();
      res.json(lista);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener ejercicios' });
    }
  };

  getEjercicioById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // llamada al servicio para obtener por id
      const ejercicio = await this.ejercicioService.obtenerPorId(id);

      if (!ejercicio) {
        return res.status(404).json({ error: 'ejercicio no encontrado' });
      }
      res.json(ejercicio);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error interno' });
    }
  };

  deleteEjercicio = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // llamada al servicio para eliminar
      const eliminado = await this.ejercicioService.eliminarEjercicio(id);

      if (!eliminado) {
        return res.status(404).json({ error: 'no se pudo eliminar' });
      }
      res.json({ message: 'ejercicio eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
