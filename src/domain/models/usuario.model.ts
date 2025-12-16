// Modelo de dominio: contrato estable que viaja entre capas.
// (OCP - Open/Closed Principle): añade campos nuevos aquí; repos/servicios usan esta forma centralizada.
export interface User {
    id?: number;
    nombre: string;
    email: string; // Dato nuevo
}
