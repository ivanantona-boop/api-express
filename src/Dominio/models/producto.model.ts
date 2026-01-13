// src/models/producto.model.ts
export interface Producto {
    id?: number; // Opcional porque al crear no lo tenemos aún
    nombre: string;
    precio: number;
}