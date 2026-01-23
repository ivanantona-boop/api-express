// Definimos los roles posibles para evitar errores de escritura
export type RolUsuario = 'USUARIO' | 'ENTRENADOR';

export interface Usuario {
  id?: string; // Opcional: Mongo lo genera, pero el dominio lo necesita para identificar
  nombre: string;
  apellidos: string;
  contraseña: string;
  DNI: string; // Tu identificador de negocio único
  rol: RolUsuario;
  id_entrenador?: string;
}

//¿Qué es? Es la Definición Pura (El plano).
//Tecnología: Solo TypeScript (interface).
//¿Qué hace? Le dice a tu aplicación qué datos tiene un usuario, sin importar si usas MongoDB, MySQL o un Excel.
//Dependencias: CERO. No importa mongoose, ni express, ni nada.
//Ejemplo: "Un usuario tiene DNI".
