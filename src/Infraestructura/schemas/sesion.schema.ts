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

/**
 * Esquema DTO (Data Transfer Object) para la creación desde la App Android.
 * Es más permisivo porque:
 * 1. No exige ID de ejercicio (viene el nombre).
 * 2. No exige ID de plan (el repositorio pone uno dummy).
 * 3. Permite rangos en repeticiones ("10-12").
 */
export const SesionAppSchema = z.object({
  idUsuario: z.string().min(1, 'El ID de usuario es obligatorio'),
  titulo: z.string().min(1, 'El título es obligatorio'),
  // Android envía la fecha como String "YYYY-MM-DD", no como objeto Date
  fechaProgramada: z.string(),

  ejercicios: z.array(
    z.object({
      nombreEjercicio: z.string().min(1, 'El nombre del ejercicio es obligatorio'),

      // Usamos coerce.number() por seguridad, por si llega como string "4"
      series: z.coerce.number().int().positive(),

      // La clave: Aceptamos string O número para permitir rangos "10-12"
      repeticiones: z.union([z.string(), z.number()]),

      peso: z.coerce.number().nonnegative().optional().default(0),
      notas: z.string().optional(),
    }),
  ),
});
