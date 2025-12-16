import { z } from 'zod';

export const UsuarioSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email({ message: "Debe ser un email válido" }) // ¡Validación de email gratis!
});