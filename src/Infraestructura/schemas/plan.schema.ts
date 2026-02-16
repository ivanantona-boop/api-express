import { z } from 'zod';

export const PlanSchema = z.object({
  objetivoPrincipal: z.string().min(5, 'El objetivo debe ser descriptivo (mínimo 5 letras)'),

  // Coerce convierte string a fecha. Default pone la fecha de hoy si no viene nada.
  fechaInicio: z.coerce.date().default(() => new Date()),

  // Al poner min(1), obligamos a que el string no esté vacío (y por tanto que exista)
  idUsuario: z.string().min(1, 'Es necesario asignar un usuario al plan'),
});
