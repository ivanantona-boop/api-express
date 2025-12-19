import { z } from 'zod';

// Definimos las reglas de validación para un ejercicio
export const EjercicioSchema = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre del ejercicio debe tener al menos 3 letras" })
    .max(100, { message: "El nombre del ejercicio es demasiado largo" }),
    
  descripcion: z.string()
    .min(10, { message: "La descripción debe tener al menos 10 letras" })
    .max(500, { message: "La descripción es demasiado larga" })
});