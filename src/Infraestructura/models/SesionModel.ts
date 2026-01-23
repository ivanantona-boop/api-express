import { Schema, model } from 'mongoose';
import { SesionEntrenamiento } from '../../Dominio/models/sesion.model';

// 1. Sub-Esquema para el Detalle (Series, Reps...)
// _id: false significa que no queremos un ID único para cada serie, solo los datos
const DetalleSesionSchema = new Schema(
  {
    id_ejercicio: { type: Schema.Types.ObjectId, ref: 'Ejercicio', required: true },
    series: { type: Number, required: true },
    repeticiones: { type: Number, required: true },
    peso: { type: Number, required: true },
    observaciones: { type: String },
  },
  { _id: false },
);

// 2. Esquema Principal de la Sesión
const SesionSchema = new Schema<SesionEntrenamiento>(
  {
    fecha: { type: Date, default: Date.now },
    finalizada: { type: Boolean, default: false },

    // RELACIONES
    id_plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

    // AQUÍ ESTÁ LA MAGIA DE MONGO:
    // En lugar de una tabla 'DetalleSesion' aparte, guardamos un array aquí mismo.
    ejercicios: [DetalleSesionSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SesionModel = model<SesionEntrenamiento>('Sesion', SesionSchema);
