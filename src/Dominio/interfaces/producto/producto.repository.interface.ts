import { Producto } from "../../../Infraestructura/models/producto.model";
export interface ProductoRepository {
    getAll(): Promise<Producto[]>;
    getById(id: number): Promise<Producto | null>;
    create(producto: Producto): Promise<Producto>;
    update(id: number, producto: Producto): Promise<Producto | null>;
    delete(id: number): Promise<void>;
}
