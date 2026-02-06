import { z } from 'zod';

export const UsuarioSchema = z.object({
  // validación del nickname: reemplaza al dni
  // usamos trim() para limpiar espacios y validamos longitud
  nickname: z
    .string()
    .min(1, 'el nickname es obligatorio') // aseguramos que no esté vacío
    .min(3, 'el nickname debe tener al menos 3 caracteres')
    .max(20, 'el nickname no puede superar los 20 caracteres')
    .trim(),

  // validación de contraseña básica
  contrasena: z.string().min(4, 'la contraseña debe tener al menos 4 caracteres'),

  nombre: z.string().min(1, 'el nombre es obligatorio'),
  apellidos: z.string().min(1, 'los apellidos son obligatorios'),

  // validación de rol: permitimos recibirlo en minúscula pero lo transformamos a mayúscula
  // esto asegura que en base de datos siempre se guarde como 'USUARIO' o 'ENTRENADOR'
  rol: z
    .enum(['USUARIO', 'ENTRENADOR', 'usuario', 'entrenador'])
    .transform((val) => val.toUpperCase() as 'USUARIO' | 'ENTRENADOR')
    .optional() // es opcional, si no viene se asignará el default en mongoose
    .default('USUARIO'),

  // campo opcional para relacionar con un entrenador
  id_entrenador: z.string().optional(),
});
