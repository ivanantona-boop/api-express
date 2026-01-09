import { Usuario } from "./usuario.interface";

export interface UsuarioService {
    getAllUsuarios(): Promise<Usuario[]>;
    getUsuarioById(id: number): Promise<Usuario | null>;
    createUsuario(usuario: Usuario): Promise<Usuario>;
    updateUsuario(id: number, usuario: Usuario): Promise<Usuario | null>;
    deleteUsuario(id: number): Promise<void>;
}
