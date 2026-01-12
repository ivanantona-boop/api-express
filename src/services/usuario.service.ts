import { Usuario } from '../models/usuario.model';
// Importamos la INTERFAZ que creamos antes, no la clase directamente
import { UsuarioRepository as IUsuarioRepository } from '../interfaces/usuario/usuario.repository.interface';

export class UsuarioService {
    
    // CAMBIO CLAVE: El servicio ahora "pide" el repositorio al ser creado
    constructor(private usuarioRepo: IUsuarioRepository) {}

    async getAllUsuarios() {
        // Ahora usamos "this.usuarioRepo" que viene del constructor
        return await this.usuarioRepo.getAll();
    }
    async getUsuarioById(id: number) {
        return await this.usuarioRepo.getById(id);
    }

    async createUsuario(data: Usuario) {
        return await this.usuarioRepo.create(data);
    }
    async updateUsuario(id: number, data: Usuario) {
        const updated = await this.usuarioRepo.update(id, data);
        if (!updated) {
            throw new Error('Usuario no encontrado para actualizar');
        }
        return { id, ...data };
    }

    async deleteUsuario(id: number) {
        const deleted = await this.usuarioRepo.delete(id);
        if (!deleted) {
            throw new Error('Usuario no encontrado para eliminar');
        }
        return true;
    }   
}
