import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';
import NodeCache from 'node-cache';

// importación de los casos de uso
import { CrearUsuarioUseCase } from '../use-cases/usuario/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../use-cases/usuario/listar-usuarios.use-case';
import { BuscarUsuarioPorDniUseCase } from '../use-cases/usuario/buscar-usuario-por-dni.use-case';
import { ActualizarUsuarioUseCase } from '../use-cases/usuario/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from '../use-cases/usuario/eliminar-usuario.use-case';

export class UsuarioService {
  // declaramos las propiedades de los casos de uso
  private readonly crearUsuarioUC: CrearUsuarioUseCase;
  private readonly listarUsuariosUC: ListarUsuariosUseCase;
  private readonly buscarUsuarioPorDniUC: BuscarUsuarioPorDniUseCase;
  private readonly actualizarUsuarioUC: ActualizarUsuarioUseCase;
  private readonly eliminarUsuarioUC: EliminarUsuarioUseCase;

  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache,
  ) {
    // instanciamos los casos de uso dentro del servicio (igual que tu tutor)
    this.crearUsuarioUC = new CrearUsuarioUseCase(this.usuarioRepository, this.cache);
    this.listarUsuariosUC = new ListarUsuariosUseCase(this.usuarioRepository, this.cache);
    this.buscarUsuarioPorDniUC = new BuscarUsuarioPorDniUseCase(this.usuarioRepository);
    this.actualizarUsuarioUC = new ActualizarUsuarioUseCase(this.usuarioRepository, this.cache);
    this.eliminarUsuarioUC = new EliminarUsuarioUseCase(this.usuarioRepository, this.cache);
  }

  // métodos fachada: el controlador llama aquí, y esto llama al caso de uso

  async registrarUsuario(usuario: Usuario) {
    return await this.crearUsuarioUC.execute(usuario);
  }

  async obtenerTodos() {
    return await this.listarUsuariosUC.execute();
  }

  async obtenerPorDNI(dni: string) {
    return await this.buscarUsuarioPorDniUC.execute(dni);
  }

  async actualizarUsuario(dni: string, datos: Partial<Usuario>) {
    return await this.actualizarUsuarioUC.execute(dni, datos);
  }

  async eliminarUsuario(dni: string) {
    return await this.eliminarUsuarioUC.execute(dni);
  }
}
