import { Usuario } from '../../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { DniVO } from '../../../Dominio/value-objects/Dni.vo';
import NodeCache from 'node-cache';

export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache, // Inyectamos la caché
  ) {}

  // CAMBIO: Pongo 'any' temporalmente para que no se queje si tu interfaz Usuario no está actualizada
  async execute(usuario: any): Promise<Usuario> {
    // 1. Leemos 'dni' en minúscula (que es lo que viene del Controller ahora)
    // Esto arregla el error "trim of undefined"
    const dniVO = DniVO.crear(usuario.dni);

    const existente = await this.usuarioRepository.getByDNI(dniVO.getValue());
    if (existente) {
      throw new Error(`El usuario con DNI ${dniVO.getValue()} ya existe`);
    }

    // 2. Construimos el objeto usando 'dni' minúscula para la base de datos
    const usuarioLimpio = {
      ...usuario,
      dni: dniVO.getValue(),
    };

    // (Opcional) Si por algún motivo venía la mayúscula, la borramos para no ensuciar la BD
    delete usuarioLimpio.DNI;

    const nuevoUsuario = await this.usuarioRepository.create(usuarioLimpio);

    // Borramos la caché para que la lista se actualice
    this.cache.del('users_all');

    return nuevoUsuario;
  }
}
