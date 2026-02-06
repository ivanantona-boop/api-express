import { UsuarioRepository } from '../../Dominio/interfaces/usuario/usuario.repository.interface';
import { Usuario } from '../../Dominio/models/usuario.model';
import { UsuarioModel } from '../models/UsuarioModel'; // asegúrate de que el nombre del archivo coincida

export class UsuarioMongoRepository implements UsuarioRepository {
  // guardar un nuevo usuario en la base de datos
  async create(usuario: Usuario): Promise<Usuario> {
    const nuevo = await UsuarioModel.create(usuario);
    return this.mapToDomain(nuevo);
  }

  // obtener todos los usuarios
  async getAll(): Promise<Usuario[]> {
    const docs = await UsuarioModel.find().lean();
    return docs.map((d) => this.mapToDomain(d));
  }

  // cambio principal: buscar por nickname en lugar de dni
  async getByNickname(nickname: string): Promise<Usuario | null> {
    // la consulta de mongoose cambia: { nickname: nickname }
    const doc = await UsuarioModel.findOne({ nickname: nickname }).lean();

    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  // cambio principal: buscar por nickname para actualizar
  async update(nickname: string, data: Partial<Usuario>): Promise<Usuario | null> {
    // buscamos por nickname y devolvemos el documento nuevo (new: true)
    const doc = await UsuarioModel.findOneAndUpdate({ nickname: nickname }, data, {
      new: true,
    }).lean();

    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  // cambio principal: buscar por nickname para eliminar
  async delete(nickname: string): Promise<boolean> {
    const result = await UsuarioModel.findOneAndDelete({ nickname: nickname });
    // convertimos el resultado a booleano (true si existía y se borró, false si no)
    return !!result;
  }

  // helper privado para limpiar los datos de mongo y convertirlos al modelo de dominio
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDomain(mongoDoc: any): Usuario {
    return {
      id: mongoDoc._id.toString(), // conversión de objectid a string
      nombre: mongoDoc.nombre,
      apellidos: mongoDoc.apellidos,
      contrasena: mongoDoc.contrasena,
      nickname: mongoDoc.nickname,

      // mapeo de los nuevos campos obligatorios y opcionales
      rol: mongoDoc.rol,
      id_entrenador: mongoDoc.id_entrenador ? mongoDoc.id_entrenador.toString() : undefined,
    };
  }
}
