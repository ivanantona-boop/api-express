import { z } from 'zod';

// Definimos las reglas de validación
export const ProductoSchema = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 letras" })
    .max(50, { message: "El nombre es demasiado largo" }),
    
  precio: z.number() 
    .positive({ message: "El precio debe ser mayor a 0" })
});