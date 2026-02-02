import { EjercicioRepository } from '../../Dominio/interfaces/ejercicio/ejercicio.repository.interface';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';
import NodeCache from 'node-cache';

// importación de los casos de uso
import { CrearEjercicioUseCase } from '../use-cases/ejercicio/crear-ejercicio.use-case';
import { ListarEjerciciosUseCase } from '../use-cases/ejercicio/listar-ejercicios.use-case';
import { ObtenerEjercicioPorIdUseCase } from '../use-cases/ejercicio/obtener-ejercicio-por-id.use-case';
import { EliminarEjercicioUseCase } from '../use-cases/ejercicio/eliminar-ejercicio.use-case';

export class EjercicioService {
  // definición de propiedades privadas para los casos de uso
  private readonly crearEjercicioUC: CrearEjercicioUseCase;
  private readonly listarEjerciciosUC: ListarEjerciciosUseCase;
  private readonly obtenerEjercicioPorIdUC: ObtenerEjercicioPorIdUseCase;
  private readonly eliminarEjercicioUC: EliminarEjercicioUseCase;

  // instancia de caché local
  private readonly cache: NodeCache;

  constructor(private readonly ejercicioRepository: EjercicioRepository) {
    // configuración de caché con tiempo de vida de 10 minutos (600 segundos)
    this.cache = new NodeCache({ stdTTL: 600 });

    // instancio los casos de uso inyectando el repositorio y la caché
    this.crearEjercicioUC = new CrearEjercicioUseCase(this.ejercicioRepository, this.cache);
    this.listarEjerciciosUC = new ListarEjerciciosUseCase(this.ejercicioRepository, this.cache);
    this.obtenerEjercicioPorIdUC = new ObtenerEjercicioPorIdUseCase(this.ejercicioRepository);
    this.eliminarEjercicioUC = new EliminarEjercicioUseCase(this.ejercicioRepository, this.cache);
  }

  // método fachada para la creación de un nuevo ejercicio
  async crearEjercicio(datos: Ejercicio): Promise<Ejercicio> {
    return await this.crearEjercicioUC.execute(datos);
  }

  // método fachada para obtener el listado completo de ejercicios
  async obtenerTodos(): Promise<Ejercicio[]> {
    return await this.listarEjerciciosUC.execute();
  }

  // método fachada para obtener un ejercicio por su identificador
  async obtenerPorId(id: string): Promise<Ejercicio | null> {
    return await this.obtenerEjercicioPorIdUC.execute(id);
  }

  // método fachada para eliminar un ejercicio
  async eliminarEjercicio(id: string): Promise<boolean> {
    return await this.eliminarEjercicioUC.execute(id);
  }
}
