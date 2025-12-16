import { z } from 'zod';

// Contrato de validación para entrada HTTP; no afecta al modelo interno.
// Respeta SRP (Single Responsibility Principle): valida formato sin tocar reglas de negocio.
export const UsuarioSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email({ message: "Debe ser un email válido" }) // ¡Validación de email gratis!
});
