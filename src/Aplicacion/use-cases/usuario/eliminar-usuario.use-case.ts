import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { DniVO } from '../../../Dominio/value-objects/Dni.vo';
import NodeCache from 'node-cache';

export class EliminarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(dni: string): Promise<boolean> {
    const dniLimpio = DniVO.crear(dni).getValue();
    const eliminado = await this.usuarioRepository.delete(dniLimpio);

    if (eliminado) {
      this.cache.del('users_all'); // Invalidar caché
    }
    return eliminado;
  }
}
