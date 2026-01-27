import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { DniVO } from '../../../Dominio/value-objects/Dni.vo';
import NodeCache from 'node-cache';

export class ActualizarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(dni: string, datos: Partial<Usuario>): Promise<Usuario | null> {
    const dniBusqueda = DniVO.crear(dni).getValue();
    const datosLimpios = { ...datos };

    if (datos.DNI) {
      const dniVO = DniVO.crear(datos.DNI);
      datosLimpios.DNI = dniVO.getValue();
    }

    const usuarioActualizado = await this.usuarioRepository.update(dniBusqueda, datosLimpios);

    if (usuarioActualizado) {
      this.cache.del('users_all'); // Invalidar caché
    }

    return usuarioActualizado;
  }
}
