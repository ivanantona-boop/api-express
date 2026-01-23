// 1. Definimos el "Detalle" (Series, Reps, Peso)
// Esto NO es una entidad independiente, es un objeto de valor dentro de la sesión
export interface DetalleSesion {
  id_ejercicio: string; // Referencia al ejercicio (Press Banca, etc.)
  series: number;
  repeticiones: number;
  peso: number;
  observaciones?: string;
}

// 2. Definimos la Sesión completa
export interface SesionEntrenamiento {
  id?: string;
  fecha: Date;
  finalizada: boolean;

  // RELACIONES
  id_plan: string; // Pertenece a un plan
  id_usuario: string; // La hace un usuario

  // LISTA DE EJERCICIOS (Tu "Detalle_Sesion" está aquí dentro)
  ejercicios: DetalleSesion[];
}
