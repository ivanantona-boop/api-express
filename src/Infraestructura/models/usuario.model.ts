export interface Usuario {
    id?: string;       // Opcional: Mongo lo genera, pero el dominio lo necesita para identificar
    nombre: string;
    apellidos: string;
    contraseña: string;
    DNI: string;       // Tu identificador de negocio único
}