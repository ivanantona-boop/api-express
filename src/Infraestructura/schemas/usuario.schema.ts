import { z } from 'zod';

export const UsuarioSchema = z.object({
    nombre: z.string().min(2, "El nombre es muy corto"),
    apellidos: z.string().min(2, "Los apellidos son muy cortos"),
    // El DNI es string y obligatorio
    DNI: z.string().min(5, "DNI inválido"), 
    contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});