import { Schema, model } from "mongoose";
import { Usuario } from "./usuario.model";

const UsuarioSchema = new Schema<Usuario>({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    contraseña: { type: String, required: true },
    DNI: { type: String, required: true, unique: true }, // Indice único
}, {
    timestamps: true,
    versionKey: false
});

export const UsuarioModel = model<Usuario>("Usuario", UsuarioSchema);