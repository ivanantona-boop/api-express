import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import NodeCache from 'node-cache';

export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {}

  async execute(usuario: Usuario): Promise<Usuario> {
    // 1. normalización del dato
    // al no tener value object, hacemos un trim() básico para evitar espacios accidentales
    // asumimos que 'usuario.nickname' es un string
    const nicknameProcesado = usuario.nickname.trim();

    // 2. verificación de existencia
    // llamamos al repositorio pasando el string directamente
    const existente = await this.usuarioRepository.getByNickname(nicknameProcesado);

    if (existente) {
      throw new Error(`el usuario con nickname ${nicknameProcesado} ya existe`);
    }

    // 3. preparación del objeto
    // creamos una copia del usuario asegurando que el nickname va limpio
    // ya no hace falta borrar dni ni transformar value objects
    const usuarioParaGuardar = {
      ...usuario,
      nickname: nicknameProcesado,
      rol: usuario.rol || 'USUARIO',
    };

    // 4. persistencia
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nuevoUsuario = await this.usuarioRepository.create(usuarioParaGuardar as any);

    // 5. gestión de caché
    // borramos la caché global de usuarios para que aparezca el nuevo registro
    this.cache.del('users_all');

    return nuevoUsuario;
  }
}
