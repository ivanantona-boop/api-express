import { Usuario } from '../../Dominio/models/usuario.model';
import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';

export class UsuarioMockRepository implements UsuarioRepository {
  // Simulamos la base de datos en un array
  private usuarios: Usuario[] = [];

  async getAll(): Promise<Usuario[]> {
    // Devolvemos una copia para evitar que se modifique el array original por fuera
    return [...this.usuarios];
  }

  // CAMBIO CLAVE: Buscamos por nickname (string), no por ID (number)
  async getByNickname(nickname: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.nickname === nickname) || null;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    // Simulamos que MongoDB genera un _id automático (un string aleatorio)
    const nuevoUsuario = {
      ...usuario,
      id: Math.random().toString(36).substring(2, 15), // Genera un string tipo "a3f12..."
    };

    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  // CAMBIO CLAVE: Actualizamos buscando por nickname y aceptamos datos parciales (Partial<Usuario>)
  async update(nickname: string, datosActualizados: Partial<Usuario>): Promise<Usuario | null> {
    const index = this.usuarios.findIndex((u) => u.nickname === nickname);

    if (index === -1) return null;

    // Mezclamos los datos viejos con los nuevos (Merge)
    const usuarioActualizado = {
      ...this.usuarios[index],
      ...datosActualizados,
    };

    this.usuarios[index] = usuarioActualizado;
    return usuarioActualizado;
  }

  // CAMBIO CLAVE: Borramos usando el nickname
  async delete(nickname: string): Promise<boolean> {
    const indice = this.usuarios.findIndex((u) => u.nickname === nickname);

    if (indice === -1) {
      return false; // No se encontró
    }

    // Eliminamos el elemento del array
    this.usuarios.splice(indice, 1);
    return true;
  }
}
