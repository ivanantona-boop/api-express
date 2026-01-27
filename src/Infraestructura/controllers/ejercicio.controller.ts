import { Request, Response } from 'express';
import { EjercicioSchema } from '../schemas/ejercicio.schema';

// importación de casos de uso
import { CrearEjercicioUseCase } from '../../Aplicacion/use-cases/ejercicio/crear-ejercicio.use-case';
import { ListarEjerciciosUseCase } from '../../Aplicacion/use-cases/ejercicio/listar-ejercicios.use-case';
import { ObtenerEjercicioPorIdUseCase } from '../../Aplicacion/use-cases/ejercicio/obtener-ejercicio-por-id.use-case';
import { EliminarEjercicioUseCase } from '../../Aplicacion/use-cases/ejercicio/eliminar-ejercicio.use-case';

export class EjercicioController {
  // inyección de dependencias de los casos de uso
  constructor(
    private readonly crearEjercicioUseCase: CrearEjercicioUseCase,
    private readonly listarEjerciciosUseCase: ListarEjerciciosUseCase,
    private readonly obtenerEjercicioPorIdUseCase: ObtenerEjercicioPorIdUseCase,
    private readonly eliminarEjercicioUseCase: EliminarEjercicioUseCase,
  ) {}

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
      // ejecución del caso de uso de creación
      const nuevo = await this.crearEjercicioUseCase.execute(validacion.data);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al crear ejercicio' });
    }
  };

  getEjercicios = async (req: Request, res: Response) => {
    try {
      // ejecución del caso de uso de listado
      const lista = await this.listarEjerciciosUseCase.execute();
      res.json(lista);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener ejercicios' });
    }
  };

  getEjercicioById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // ejecución del caso de uso de búsqueda por id
      const ejercicio = await this.obtenerEjercicioPorIdUseCase.execute(id);

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
      // ejecución del caso de uso de eliminación
      const eliminado = await this.eliminarEjercicioUseCase.execute(id);

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
