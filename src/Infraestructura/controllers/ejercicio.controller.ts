import { Request, Response } from 'express';
import { EjercicioService } from '../../Aplicacion/services/ejercicio.service';
import { EjercicioSchema } from '../schemas/ejercicio.schema';

export class EjercicioController {
  constructor(private readonly ejercicioService: EjercicioService) {}

  createEjercicio = async (req: Request, res: Response) => {
    // 1. VALIDACIÓN CON ZOD
    const validacion = EjercicioSchema.safeParse(req.body);

    if (!validacion.success) {
      // Si falla, devolvemos 400 Bad Request y los detalles del error
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: validacion.error.issues,
      });
    }

    try {
      // 2. Usamos validacion.data (Tipado y limpio)
      const nuevo = await this.ejercicioService.crearEjercicio(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear ejercicio' });
    }
  };

  getEjercicios = async (req: Request, res: Response) => {
    try {
      const lista = await this.ejercicioService.obtenerTodos();
      res.json(lista);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener ejercicios' });
    }
  };

  getEjercicioById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ejercicio = await this.ejercicioService.obtenerPorId(id);
      if (!ejercicio) return res.status(404).json({ error: 'Ejercicio no encontrado' });
      res.json(ejercicio);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno' });
    }
  };

  deleteEjercicio = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eliminado = await this.ejercicioService.eliminarEjercicio(id);
      if (!eliminado) return res.status(404).json({ error: 'No se pudo eliminar' });
      res.json({ message: 'Ejercicio eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
