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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id_plan: { type: Schema.Types.ObjectId as any, ref: 'Plan', required: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id_usuario: { type: Schema.Types.ObjectId as any, ref: 'Usuario', required: true },

    // AQUÍ ESTÁ LA MAGIA DE MONGO:
    // En lugar de una tabla 'DetalleSesion' aparte, guardamos un array aquí mismo.
    ejercicios: [DetalleSesionSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// 3. Limpieza de datos (Quitar _id y __v al devolver JSON)
SesionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  // 👇 ESLINT: Ignoramos 'any' para poder borrar propiedades de ret
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
  },
});

export const SesionModel = model<SesionEntrenamiento>('Sesion', SesionSchema);
