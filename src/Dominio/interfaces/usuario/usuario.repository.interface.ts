import { Usuario } from '../../models/usuario.model';

export interface UsuarioRepository {
  create(usuario: Usuario): Promise<Usuario>;
  getAll(): Promise<Usuario[]>;
  getByDNI(dni: string): Promise<Usuario | null>;
  update(dni: string, usuario: Partial<Usuario>): Promise<Usuario | null>;
  delete(dni: string): Promise<boolean>;
}
