import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';

export class UsuarioMockRepository implements UsuarioRepository {
  private usuarios: Usuario[] = [];

  async create(usuario: Usuario): Promise<Usuario> {
    const nuevo = { ...usuario, id: usuario.id || 'mock-id-' + Date.now() };
    this.usuarios.push(nuevo);
    return nuevo;
  }

  async getAll(): Promise<Usuario[]> {
    return this.usuarios;
  }

  // --- ESTE ES EL MÉTODO QUE FALTABA Y CAUSABA EL ERROR ---
  async getByRol(rol: 'USUARIO' | 'ENTRENADOR'): Promise<Usuario[]> {
    return this.usuarios.filter((u) => u.rol === rol);
  }

  async getByNickname(nickname: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.nickname === nickname) || null;
  }

  async update(nickname: string, data: Partial<Usuario>): Promise<Usuario | null> {
    const index = this.usuarios.findIndex((u) => u.nickname === nickname);
    if (index === -1) return null;
    this.usuarios[index] = { ...this.usuarios[index], ...data };
    return this.usuarios[index];
  }

  async delete(nickname: string): Promise<boolean> {
    const inicial = this.usuarios.length;
    this.usuarios = this.usuarios.filter((u) => u.nickname !== nickname);
    return this.usuarios.length < inicial;
  }
}
