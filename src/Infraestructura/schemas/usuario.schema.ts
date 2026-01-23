import { z } from 'zod';

export const UsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  contraseña: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),

  // Validación de DNI (8 números y 1 letra)
  DNI: z.string().regex(/^[0-9]{8}[A-Za-z]$/, 'Formato de DNI inválido (12345678Z)'),

  // --- NUEVOS CAMPOS ---

  // Rol: Opcional. Si no lo envían, Zod lo rellenará automáticamente con 'USUARIO'
  rol: z.enum(['USUARIO', 'ENTRENADOR']).optional().default('USUARIO'),

  // Entrenador: Opcional, debe ser un string válido si se envía
  id_entrenador: z.string().optional(),
});
