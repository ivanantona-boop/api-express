import { Schema, model } from 'mongoose';
import { PlanEntrenamiento } from '../../Dominio/models/plan.model';

const PlanSchema = new Schema<PlanEntrenamiento>(
  {
    objetivo_principal: { type: String, required: true },
    objetivo_secundario: { type: String },
    fecha_inicio: { type: Date, default: Date.now },

    // RELACIÓN: Apunta a la colección 'Usuario'
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PlanModel = model<PlanEntrenamiento>('Plan', PlanSchema);
