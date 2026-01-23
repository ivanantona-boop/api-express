import { z } from 'zod';

// 1. Sub-esquema para validar CADA ejercicio dentro de la sesión
const DetalleSesionSchema = z.object({
  // Validamos que venga el ID
  id_ejercicio: z.string().min(1, 'Debes indicar el ID del ejercicio'),

  // Simplificamos: z.number() sin argumentos.
  // Si envían un texto, Zod dirá "Expected number, received string" automáticamente.
  series: z
    .number()
    .int('Las series deben ser un número entero')
    .positive('Las series deben ser mayor a 0'),

  repeticiones: z
    .number()
    .int('Las repeticiones deben ser un número entero')
    .positive('Las repeticiones deben ser mayor a 0'),

  peso: z.number().nonnegative('El peso no puede ser negativo'), // Permite 0

  observaciones: z.string().optional(),
});

// 2. Esquema principal de la Sesión
export const SesionSchema = z.object({
  fecha: z.coerce.date().default(() => new Date()),
  finalizada: z.boolean().optional().default(false),

  id_plan: z.string().min(1, 'Falta el ID del plan'),
  id_usuario: z.string().min(1, 'Falta el ID del usuario'),

  // Validación del array
  ejercicios: z.array(DetalleSesionSchema).optional().default([]),
});
