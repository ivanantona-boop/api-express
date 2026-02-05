import { z } from 'zod';

export const UsuarioSchema = z.object({
  // Cambiamos 'DNI' a 'dni' (minúscula) y ajustamos el regex
  dni: z
    .string()
    .regex(/^[0-9]{8}[A-Za-z]$/, 'El DNI debe tener 8 números y 1 letra (Ej: 12345678A)'),

  // Cambiamos 'contraseña' a 'contrasena' (sin Ñ, por amor a la programación)
  contrasena: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),

  nombre: z.string(),
  apellidos: z.string(),
  nombreCompleto: z.string().optional(),

  // Aceptamos minúsculas o mayúsculas en el rol para no sufrir
  rol: z
    .enum(['USUARIO', 'ENTRENADOR', 'usuario', 'entrenador', 'cliente'])
    .transform((val) => val.toUpperCase()),
});
