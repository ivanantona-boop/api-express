import { Schema, model } from 'mongoose';
import { Usuario } from '../../Dominio/models/usuario.model';

const UsuarioSchema = new Schema<Usuario>(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    contrasena: { type: String, required: true }, // Perfecto, ya está sin Ñ

    // CORRECCIÓN AQUÍ: Cambiamos 'DNI' por 'dni' (minúscula)
    dni: { type: String, required: true, unique: true },

    // --- NUEVOS CAMPOS NECESARIOS PARA TUS REQUISITOS ---

    // 1. ROL: Para saber si es Cliente o Entrenador
    rol: {
      type: String,
      enum: ['USUARIO', 'ENTRENADOR'],
      default: 'USUARIO',
      required: true,
    },

    // 2. ENTRENADOR: Relación (Foreign Key en SQL)
    id_entrenador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UsuarioModel = model<Usuario>('Usuario', UsuarioSchema);
