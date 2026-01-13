import { Usuario } from '../models/usuario.model';
import { UsuarioRepository as IUsuarioRepository } from '../interfaces/usuario/usuario.repository.interface';

export class UsuarioMockRepository implements IUsuarioRepository {
    private usuarios: Usuario[] = []; // Base de datos temporal en memoria

    async getAll(): Promise<Usuario[]> {
        return [...this.usuarios]; // Devolvemos una copia para evitar mutaciones externas
    }

    async getById(id: number): Promise<Usuario | null> {
        return this.usuarios.find(u => u.id === id) || null;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const nuevo = { ...usuario, id: this.usuarios.length + 1 };
        this.usuarios.push(nuevo);
        return nuevo;
    }

    async update(id: number, datosActualizados: Usuario): Promise<Usuario | null> {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index === -1) return null;

        // Actualizamos el objeto en el array
        this.usuarios[index] = { ...datosActualizados, id };
        return this.usuarios[index];
    }

    async delete(id: number): Promise<boolean> {
        // Filtramos el array para eliminar al usuario
        const usuarioExistente = this.usuarios.find(u => u.id === id);
        if (!usuarioExistente) {
            return false; // Usuario no encontrado
        }
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        return true;
    }
}