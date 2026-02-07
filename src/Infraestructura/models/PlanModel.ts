import mongoose, { Schema } from 'mongoose';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';

const PlanSchema = new Schema<PlanEntrenamiento>(
  {
    objetivo_principal: { type: String, required: true },
    objetivo_secundario: { type: String },
    // Mantenemos el 'as any' que pusimos antes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id_usuario: { type: Schema.Types.ObjectId as any, ref: 'Usuario', required: true },
    fecha_inicio: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PlanSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  //  Tipamos 'ret' como any para poder borrar propiedades sin miedo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v; // Borramos también la versión interna de mongo
  },
});

// Mongoose ya infiere los métodos.
export const PlanModel = mongoose.model<PlanEntrenamiento>('Plan', PlanSchema);
