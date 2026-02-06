import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../../Dominio/models/usuario.model';

export class LoginUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(nickname: string, contrasena: string): Promise<Usuario> {
    // 1. Buscamos al usuario por su nickname
    const usuario = await this.usuarioRepository.getByNickname(nickname);

    // 2. Si no existe, lanzamos error (el controlador lo capturará y devolverá 404)
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // 3. Verificamos la contraseña
    // NOTA: Aquí es donde más adelante pondremos 'bcrypt.compare'
    // Por ahora, usamos comparación directa para validar que el flujo funciona.
    // Usamos (usuario as any) por si tu modelo es estricto y no expone la contraseña.
    if ((usuario as any).contrasena !== contrasena) {
      throw new Error('Contraseña incorrecta');
    }

    // 4. Si todo va bien, devolvemos el usuario
    return usuario;
  }
}
