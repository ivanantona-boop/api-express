import { UsuarioRepository } from '../../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../../Dominio/models/usuario.model';
import NodeCache from 'node-cache';

export class ListarClientesUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly cache: NodeCache, // Opcional
  ) {}

  async execute(): Promise<Usuario[]> {
    // LÓGICA CLAVE: No usamos getAll(), usamos getByRol
    // Queremos SOLO los que son 'USUARIO'
    const clientes = await this.usuarioRepository.getByRol('USUARIO');

    return clientes;
  }
}
