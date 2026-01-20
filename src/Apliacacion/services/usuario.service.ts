import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';

export class UsuarioService {
    
    // INYECCIÓN DE DEPENDENCIA:
    // No hacemos "new MongoRepository()". Pedimos CUALQUIER cosa que cumpla la interfaz.
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async registrarUsuario(usuario: Usuario): Promise<Usuario> {
        // Aquí podrías validar si el DNI ya existe antes de intentar crear
        const existente = await this.usuarioRepository.getByDNI(usuario.DNI);
        if (existente) {
            throw new Error(`El usuario con DNI ${usuario.DNI} ya existe`);
        }
        
        // Aquí deberías hashear la contraseña antes de guardar (ej. bcrypt)
        // usuario.contraseña = await hash(usuario.contraseña)...
        
        return await this.usuarioRepository.create(usuario);
    }

    async obtenerTodos(): Promise<Usuario[]> {
        return await this.usuarioRepository.getAll();
    }

    async obtenerPorDNI(dni: string): Promise<Usuario | null> {
        return await this.usuarioRepository.getByDNI(dni);
    }

    async actualizarUsuario(dni: string, datos: Partial<Usuario>): Promise<Usuario | null> {
        return await this.usuarioRepository.update(dni, datos);
    }

    async eliminarUsuario(dni: string): Promise<boolean> {
        return await this.usuarioRepository.delete(dni);
    }
}