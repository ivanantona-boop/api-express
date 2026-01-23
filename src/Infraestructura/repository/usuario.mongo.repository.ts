import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';
import { UsuarioModel } from '../models/UsuarioModel';

export class UsuarioMongoRepository implements UsuarioRepository {
  async create(usuario: Usuario): Promise<Usuario> {
    const nuevo = await UsuarioModel.create(usuario);
    return this.mapToDomain(nuevo);
  }

  async getAll(): Promise<Usuario[]> {
    const docs = await UsuarioModel.find().lean();
    return docs.map((d) => this.mapToDomain(d));
  }

  async getByDNI(dni: string): Promise<Usuario | null> {
    const doc = await UsuarioModel.findOne({ DNI: dni }).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async update(dni: string, data: Partial<Usuario>): Promise<Usuario | null> {
    const doc = await UsuarioModel.findOneAndUpdate({ DNI: dni }, data, { new: true }).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async delete(dni: string): Promise<boolean> {
    const result = await UsuarioModel.findOneAndDelete({ DNI: dni });
    return !!result;
  }

  // Helper privado para limpiar los datos de Mongo (_id) a tu Dominio (id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDomain(mongoDoc: any): Usuario {
    return {
      id: mongoDoc._id.toString(),
      nombre: mongoDoc.nombre,
      apellidos: mongoDoc.apellidos,
      contraseña: mongoDoc.contraseña,
      DNI: mongoDoc.DNI,

      // Rol es obligatorio en tu interfaz Usuario
      rol: mongoDoc.rol,

      //  id_entrenador es opcional, lo convertimos a string si existe
      id_entrenador: mongoDoc.id_entrenador ? mongoDoc.id_entrenador.toString() : undefined,
    };
  }
}
