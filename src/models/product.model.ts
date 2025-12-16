// src/models/product.model.ts
export interface Product {
    id?: number; // Opcional porque al crear no lo tenemos aún
    nombre: string;
    precio: number;
}