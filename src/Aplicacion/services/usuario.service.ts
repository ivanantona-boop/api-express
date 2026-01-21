import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Infraestructura/models/usuario.model';
import NodeCache from 'node-cache';
import { DniVO } from '../../Dominio/value-objects/Dni.vo';

export class UsuarioService {
  // Configuración de Caché
  private cache = new NodeCache({ stdTTL: 300 });
  private readonly CACHE_KEY_ALL = 'users_all';

  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  // --- LECTURA ---

  async obtenerTodos(): Promise<Usuario[]> {
    const datosEnCache = this.cache.get<Usuario[]>(this.CACHE_KEY_ALL);

    if (datosEnCache) {
      console.log('⚡ Cache HIT: Devolviendo usuarios desde memoria RAM');
      return datosEnCache;
    }

    console.log('🐌 Cache MISS: Consultando MongoDB...');
    const usuarios = await this.usuarioRepository.getAll();
    this.cache.set(this.CACHE_KEY_ALL, usuarios);

    return usuarios;
  }

  async obtenerPorDNI(dni: string): Promise<Usuario | null> {
    const dniVO = DniVO.crear(dni);
    return await this.usuarioRepository.getByDNI(dniVO.getValue());
  }

  // --- ESCRITURA (CORREGIDA) ---

  async registrarUsuario(usuario: Usuario): Promise<Usuario> {
    // 1. Usamos el Value Object para validar y normalizar
    const dniVO = DniVO.crear(usuario.DNI);

    // 2. Creamos el objeto limpio
    const usuarioLimpio = {
      ...usuario,
      DNI: dniVO.getValue(), // Guardamos el DNI limpio (ej: "1234A")
    };

    // Validación: buscamos si ya existe usando el DNI limpio
    const existente = await this.usuarioRepository.getByDNI(dniVO.getValue());
    if (existente) {
      throw new Error(`El usuario con DNI ${dniVO.getValue()} ya existe`);
    }

    // ✅ CORRECCIÓN AQUÍ:
    // Antes pasabas 'usuario', ahora pasamos 'usuarioLimpio'
    // Así ESLint deja de quejarse y la BD recibe el dato correcto.
    const nuevoUsuario = await this.usuarioRepository.create(usuarioLimpio);

    // Invalidar caché
    this.cache.del(this.CACHE_KEY_ALL);

    return nuevoUsuario;
  }

  async actualizarUsuario(dni: string, datos: Partial<Usuario>): Promise<Usuario | null> {
    const dniBusqueda = DniVO.crear(dni).getValue();

    const datosLimpios = { ...datos };
    if (datos.DNI) {
      const dniVO = DniVO.crear(datos.DNI);
      datosLimpios.DNI = dniVO.getValue();
    }

    const usuarioActualizado = await this.usuarioRepository.update(dniBusqueda, datosLimpios);

    if (usuarioActualizado) {
      this.cache.del(this.CACHE_KEY_ALL);
    }
    return usuarioActualizado;
  }

  async eliminarUsuario(dni: string): Promise<boolean> {
    const dniLimpio = DniVO.crear(dni).getValue();
    const eliminado = await this.usuarioRepository.delete(dniLimpio);

    if (eliminado) {
      this.cache.del(this.CACHE_KEY_ALL);
    }
    return eliminado;
  }
}
