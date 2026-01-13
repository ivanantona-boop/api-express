import { Usuario } from '../../models/usuario.model';
export interface UsuarioRepository {
    getAll(): Promise<Usuario[]>;
    getById(id: number): Promise<Usuario | null>;
    create(usuario: Usuario): Promise<Usuario>;
    update(id: number, usuario: Usuario): Promise<Usuario | null>;
    delete(id: number): Promise<boolean>;
}
