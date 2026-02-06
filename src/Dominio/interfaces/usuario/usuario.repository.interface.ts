import { Usuario } from '../../models/usuario.model';

export interface UsuarioRepository {
  create(usuario: Usuario): Promise<Usuario>;
  getAll(): Promise<Usuario[]>;
  getByNickname(nickname: string): Promise<Usuario | null>;
  update(nickname: string, usuario: Partial<Usuario>): Promise<Usuario | null>;
  delete(nickname: string): Promise<boolean>;
}
