import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Infraestructura/models/usuario.model';
import NodeCache from 'node-cache'; // 1. Importamos la librería

export class UsuarioService {
  // 2. Configuración de Caché
  // stdTTL: 300 segundos (5 minutos) de vida para los datos
  private cache = new NodeCache({ stdTTL: 300 });
  private readonly CACHE_KEY_ALL = 'users_all'; // La "caja" donde guardamos la lista

  // INYECCIÓN DE DEPENDENCIA
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  // --- LECTURA CON CACHÉ (Performance) ---

  async obtenerTodos(): Promise<Usuario[]> {
    // A. ¿Tenemos la lista en memoria?
    const datosEnCache = this.cache.get<Usuario[]>(this.CACHE_KEY_ALL);

    if (datosEnCache) {
      console.log('Cache HIT: Devolviendo usuarios desde memoria RAM');
      return datosEnCache;
    }

    // B. Si no está (Cache Miss), vamos a la base de datos
    console.log('Cache MISS: Consultando MongoDB...');
    const usuarios = await this.usuarioRepository.getAll();

    // C. Guardamos el resultado en caché para la próxima vez
    this.cache.set(this.CACHE_KEY_ALL, usuarios);

    return usuarios;
  }

  async obtenerPorDNI(dni: string): Promise<Usuario | null> {
    // Nota: Podríamos cachear usuarios individuales también,
    // pero por ahora nos centramos en la lista pesada.
    return await this.usuarioRepository.getByDNI(dni);
  }

  // --- ESCRITURA CON INVALIDACIÓN (Consistencia) ---

  async registrarUsuario(usuario: Usuario): Promise<Usuario> {
    // Validación de negocio
    const existente = await this.usuarioRepository.getByDNI(usuario.DNI);
    if (existente) {
      throw new Error(`El usuario con DNI ${usuario.DNI} ya existe`);
    }
    // Creación en BD
    const nuevoUsuario = await this.usuarioRepository.create(usuario);

    // INVALIDACIÓN:
    // Como hemos creado uno nuevo, la lista guardada en caché ya es vieja.
    // La borramos para obligar a recargarla la próxima vez.
    this.cache.del(this.CACHE_KEY_ALL);

    return nuevoUsuario;
  }

  async actualizarUsuario(dni: string, datos: Partial<Usuario>): Promise<Usuario | null> {
    const usuarioActualizado = await this.usuarioRepository.update(dni, datos);

    if (usuarioActualizado) {
      // INVALIDACIÓN: Los datos cambiaron, limpiamos caché.
      this.cache.del(this.CACHE_KEY_ALL);
    }
    return usuarioActualizado;
  }

  async eliminarUsuario(dni: string): Promise<boolean> {
    const eliminado = await this.usuarioRepository.delete(dni);

    if (eliminado) {
      // INVALIDACIÓN: Falta un usuario, limpiamos caché.
      this.cache.del(this.CACHE_KEY_ALL);
    }
    return eliminado;
  }
}
