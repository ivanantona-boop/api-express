import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import NodeCache from 'node-cache';

export class EliminarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(nickname: string): Promise<boolean> {
    // limpieza del nickname eliminando espacios en blanco al inicio y al final para evitar errores de búsqueda
    const nicknameLimpio = nickname.trim();

    // llamada al repositorio para realizar el borrado físico del usuario usando su nickname
    const eliminado = await this.usuarioRepository.delete(nicknameLimpio);

    // si la eliminación en base de datos fue exitosa, invalidamos la caché de la lista general
    // esto fuerza a que la próxima petición de "listar usuarios" consulte a la base de datos de nuevo
    if (eliminado) {
      this.cache.del('users_all');
    }

    return eliminado;
  }
}
