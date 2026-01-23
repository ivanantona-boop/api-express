import { z } from 'zod';

export const EjercicioSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre del ejercicio es obligatorio') // Cubre vacío y requerido
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
});
