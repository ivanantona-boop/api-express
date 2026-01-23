import { Schema, model } from 'mongoose';
import { Usuario } from '../../Dominio/models/usuario.model';

const UsuarioSchema = new Schema<Usuario>(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    contraseña: { type: String, required: true },
    DNI: { type: String, required: true, unique: true }, // Indice único

    // --- NUEVOS CAMPOS NECESARIOS PARA TUS REQUISITOS ---

    // 1. ROL: Para saber si es Cliente o Entrenador
    rol: {
      type: String,
      enum: ['USUARIO', 'ENTRENADOR'], // Validador de Mongo: Solo deja entrar estos dos textos
      default: 'USUARIO', // Si no envías nada, será USUARIO por defecto
      required: true,
    },

    // 2. ENTRENADOR: Relación (Foreign Key en SQL)
    // Usamos Schema.Types.ObjectId porque es el formato de IDs de MongoDB
    id_entrenador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario', // <-- "ref" le dice a Mongo que este ID pertenece a la colección 'Usuario'
      required: false, // Es opcional (un entrenador no tiene entrenador superior)
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UsuarioModel = model<Usuario>('Usuario', UsuarioSchema);
//¿Qué es? Es la Implementación Técnica (El ladrillo).
//Tecnología: Mongoose (Schema, model).
//¿Qué hace? Le dice a la base de datos cómo guardar esos datos. Aquí defines índices únicos, tipos de datos de Mongo (ObjectId), valores por defecto, etc.
//Dependencias: Depende de mongoose y de la interfaz del Dominio.
//Ejemplo: "El campo DNI es un String y debe ser unique: true en la base de datos".
