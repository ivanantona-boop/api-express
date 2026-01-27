import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { DniVO } from '../../../Dominio/value-objects/Dni.vo';
import NodeCache from 'node-cache';

export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache, // Inyectamos la caché
  ) {}

  async execute(usuario: Usuario): Promise<Usuario> {
    const dniVO = DniVO.crear(usuario.DNI);

    const existente = await this.usuarioRepository.getByDNI(dniVO.getValue());
    if (existente) {
      throw new Error(`El usuario con DNI ${dniVO.getValue()} ya existe`);
    }

    const usuarioLimpio = { ...usuario, DNI: dniVO.getValue() };
    const nuevoUsuario = await this.usuarioRepository.create(usuarioLimpio);

    // Borramos la caché para que la lista se actualice
    this.cache.del('users_all');

    return nuevoUsuario;
  }
}
