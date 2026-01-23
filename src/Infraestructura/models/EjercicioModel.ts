import { Schema, model } from 'mongoose';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';

const EjercicioSchema = new Schema<Ejercicio>(
  {
    nombre: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EjercicioModel = model<Ejercicio>('Ejercicio', EjercicioSchema);
