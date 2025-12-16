// Modelo de dominio: define la forma del producto en todas las capas.
// (SRP - Single Responsibility Principle): solo describe datos; no mezcla validación ni lógica.
export interface Product {
    id?: number; // Opcional porque al crear no lo tenemos aún
    nombre: string;
    precio: number;
}
