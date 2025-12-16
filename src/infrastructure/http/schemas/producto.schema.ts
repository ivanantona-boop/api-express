import { z } from 'zod';

// Validaciones de entrada: mantienen SRP (Single Responsibility Principle) evitando meter reglas HTTP en el dominio.
export const ProductoSchema = z.object({
  nombre: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 letras" })
    .max(50, { message: "El nombre es demasiado largo" }),
    
  precio: z.number() 
    .positive({ message: "El precio debe ser mayor a 0" })
});
