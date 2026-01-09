import { Usuario } from '../models/usuario.model';
import { UsuarioRepository as IUsuarioRepository } from '../interfaces/usuario/usuario.repository.interface';

export class UsuarioMockRepository implements IUsuarioRepository {
    private usuarios: Usuario[] = []; // Base de datos temporal en memoria

    async getAll(): Promise<Usuario[]> {
        return this.usuarios;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const nuevo = { ...usuario, id: this.usuarios.length + 1 };
        this.usuarios.push(nuevo);
        return nuevo;
    }

    // ... implementas los demás métodos vacíos o con lógica simple
    async getById(id: number) { return this.usuarios.find(u => u.id === id) || null; }
    async update(id: number, u: Usuario) { return u; }
    async delete(id: number) { return; }
}