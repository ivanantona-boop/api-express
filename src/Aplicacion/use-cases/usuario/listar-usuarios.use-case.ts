import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import NodeCache from 'node-cache';

export class ListarUsuariosUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(): Promise<Usuario[]> {
    const CACHE_KEY = 'users_all';

    // 1. Intentamos leer de caché
    const datosEnCache = this.cache.get<Usuario[]>(CACHE_KEY);
    if (datosEnCache) {
      console.log('⚡ Cache HIT: Devolviendo usuarios desde memoria RAM');
      return datosEnCache;
    }

    // 2. Si no está, vamos a Mongo
    console.log('Cache MISS: Consultando MongoDB...');
    const usuarios = await this.usuarioRepository.getAll();

    // 3. Guardamos en caché
    this.cache.set(CACHE_KEY, usuarios);

    return usuarios;
  }
}
