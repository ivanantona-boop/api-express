import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import NodeCache from 'node-cache';

export class ListarUsuariosUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(): Promise<Usuario[]> {
    const cacheKey = 'users_all';

    // intento de leer los datos directamente de la memoria caché
    // esto evita consultas innecesarias a la base de datos si la información es reciente
    const datosEnCache = this.cache.get<Usuario[]>(cacheKey);

    if (datosEnCache) {
      console.log('cache hit: devolviendo usuarios desde memoria ram');
      return datosEnCache;
    }

    // si los datos no están en caché (cache miss), se realiza la consulta a mongodb
    console.log('cache miss: consultando base de datos...');
    const usuarios = await this.usuarioRepository.getAll();

    // guardado de los resultados en caché para agilizar futuras peticiones
    // la clave 'users_all' será invalidada cuando se cree o modifique un usuario
    this.cache.set(cacheKey, usuarios);

    return usuarios;
  }
}
