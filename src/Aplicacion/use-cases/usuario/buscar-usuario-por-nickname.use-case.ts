import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';

export class BuscarUsuarioPorNicknameUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(nickname: string): Promise<Usuario | null> {
    // limpieza del parámetro de entrada eliminando espacios en blanco al inicio y final
    const nicknameLimpio = nickname.trim();

    // llamada directa al repositorio para recuperar el usuario por su identificador único
    return await this.usuarioRepository.getByNickname(nicknameLimpio);
  }
}
