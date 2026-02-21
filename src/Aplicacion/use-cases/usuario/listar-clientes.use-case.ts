import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../../Dominio/models/usuario.model';
import NodeCache from 'node-cache';

export class ListarClientesUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(): Promise<Usuario[]> {
    const cacheKey = 'clientes_list';
    const cachedData = this.cache.get<Usuario[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    // Buscamos usuarios con el rol estandarizado
    // Si en tu base de datos usas ALUMNO, cambia 'USUARIO' por 'ALUMNO' aqui
    const clientes = await this.usuarioRepository.getByRol('USUARIO');

    this.cache.set(cacheKey, clientes, 600); // Cache por 10 minutos
    return clientes;
  }
}
