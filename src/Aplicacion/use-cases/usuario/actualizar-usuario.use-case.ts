import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import NodeCache from 'node-cache';

export class ActualizarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(nicknameOriginal: string, datos: Partial<Usuario>): Promise<Usuario | null> {
    // limpieza del nickname de búsqueda para asegurar que no haya espacios accidentales
    const nicknameBusqueda = nicknameOriginal.trim();

    // creación de una copia de los datos para manipularlos sin afectar al objeto original
    const datosLimpios = { ...datos };

    // si en los datos a actualizar viene un nuevo nickname, también lo limpiamos
    // esto asegura que si el usuario cambia su nombre, se guarde sin espacios extra
    if (datos.nickname) {
      datosLimpios.nickname = datos.nickname.trim();
    }

    // llamada al repositorio pasando el nickname actual como identificador
    const usuarioActualizado = await this.usuarioRepository.update(nicknameBusqueda, datosLimpios);

    // si la actualización fue exitosa, invalidamos la caché de lista de usuarios
    // esto obliga a que la próxima vez que alguien pida "todos los usuarios", se lean los datos nuevos de la base de datos
    if (usuarioActualizado) {
      this.cache.del('users_all');
    }

    return usuarioActualizado;
  }
}
