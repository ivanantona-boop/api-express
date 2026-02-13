import { z } from 'zod';

// 1. Sub-esquema para validar CADA ejercicio dentro de la sesión (Dominio interno)
const DetalleSesionSchema = z.object({
  // Validamos que venga el ID (lo genera Mongo o viene del plan)
  id_ejercicio: z.string().min(1, 'Debes indicar el ID del ejercicio'),

  // --- AÑADIDO: Permitimos que el ejercicio tenga un nombre guardado ---
  // (Ej: "Sentadilla", "Press Banca")
  nombre: z.string().optional(),

  // Simplificamos: z.number() sin argumentos.
  series: z
    .number()
    .int('Las series deben ser un número entero')
    .positive('Las series deben ser mayor a 0'),

  // OJO: Si quieres guardar "10-12", aquí deberías permitir string.
  // De momento lo dejo como number para no romper tu lógica actual.
  repeticiones: z
    .number()
    .int('Las repeticiones deben ser un número entero')
    .positive('Las repeticiones deben ser mayor a 0'),

  peso: z.number().nonnegative('El peso no puede ser negativo'), // Permite 0

  observaciones: z.string().optional(),
});

// 2. Esquema principal de la Sesión (Lo que se guarda en BD)
export const SesionSchema = z.object({
  idUsuario: z.string().min(1),
  titulo: z.string().min(1),
  fechaProgramada: z.string(),
  ejercicios: z.array(
    z.object({
      nombre: z.string().min(1), // COINCIDE con @SerialName("nombre") de Kotlin
      series: z.coerce.number().int().positive(),
      repeticiones: z.union([z.string(), z.number()]),
      peso: z.coerce.number().nonnegative().optional().default(0),
      observaciones: z.string().optional(), // COINCIDE con @SerialName("observaciones") de Kotlin
      bloque: z.number().optional().default(0),
    }),
  ),
});

/**
 * Esquema DTO (Data Transfer Object) para la creación desde la App Android.
 * Este valida LO QUE LLEGA de la petición HTTP.
 */
export const SesionAppSchema = z.object({
  idUsuario: z.string().min(1, 'El ID de usuario es obligatorio'),

  // Aquí validamos que Android OBLIGATORIAMENTE envíe un título
  titulo: z.string().min(1, 'El título es obligatorio'),

  // Android envía la fecha como String "YYYY-MM-DD", no como objeto Date
  fechaProgramada: z.string(),

  ejercicios: z.array(
    z.object({
      // Android nos envía esto como "nombreEjercicio":
      nombreEjercicio: z.string().min(1, 'El nombre del ejercicio es obligatorio'),

      series: z.coerce.number().int().positive(),
      // Aceptamos string O número para permitir rangos "10-12"
      repeticiones: z.union([z.string(), z.number()]),
      peso: z.coerce.number().nonnegative().optional().default(0),
      notas: z.string().optional(),
      bloque: z.number().optional().default(0),
    }),
  ),
});
