import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { DniVO } from '../../../Dominio/value-objects/Dni.vo';

export class BuscarUsuarioPorDniUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(dni: string): Promise<Usuario | null> {
    const dniVO = DniVO.crear(dni);
    return await this.usuarioRepository.getByDNI(dniVO.getValue());
  }
}
