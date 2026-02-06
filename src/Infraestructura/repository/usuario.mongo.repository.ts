import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';
import { UsuarioModel } from '../models/UsuarioModel'; // Asegúrate de que la ruta sea correcta

export class UsuarioMongoRepository implements UsuarioRepository {
  // Guardar un nuevo usuario
  async create(usuario: Usuario): Promise<Usuario> {
    const nuevo = await UsuarioModel.create(usuario);
    return this.mapToDomain(nuevo);
  }

  // Obtener todos (sin filtros)
  async getAll(): Promise<Usuario[]> {
    const docs = await UsuarioModel.find().lean();
    return docs.map((d) => this.mapToDomain(d));
  }

  // --- NUEVO MÉTODO QUE FALTABA ---
  // Necesario para el caso de uso "Listar Clientes"
  async getByRol(rol: 'USUARIO' | 'ENTRENADOR'): Promise<Usuario[]> {
    // Busca en Mongo todos los documentos donde el campo 'rol' coincida
    const docs = await UsuarioModel.find({ rol: rol }).lean();
    return docs.map((d) => this.mapToDomain(d));
  }

  // Buscar por nickname
  async getByNickname(nickname: string): Promise<Usuario | null> {
    const doc = await UsuarioModel.findOne({ nickname: nickname }).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  // Actualizar por nickname
  async update(nickname: string, data: Partial<Usuario>): Promise<Usuario | null> {
    const doc = await UsuarioModel.findOneAndUpdate({ nickname: nickname }, data, {
      new: true, // Devuelve el documento ya actualizado
    }).lean();

    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  // Eliminar por nickname
  async delete(nickname: string): Promise<boolean> {
    const result = await UsuarioModel.findOneAndDelete({ nickname: nickname });
    return !!result;
  }

  // Helper privado para mapear de Mongo a tu Modelo de Dominio
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDomain(mongoDoc: any): Usuario {
    return {
      id: mongoDoc._id.toString(),
      nombre: mongoDoc.nombre,
      apellidos: mongoDoc.apellidos,
      contrasena: mongoDoc.contrasena,
      nickname: mongoDoc.nickname,
      rol: mongoDoc.rol,
      // Manejo seguro del campo opcional id_entrenador
      id_entrenador: mongoDoc.id_entrenador ? mongoDoc.id_entrenador.toString() : undefined,
    };
  }
}
