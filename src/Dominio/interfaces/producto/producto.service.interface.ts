import { Producto } from "../../models/producto.model"; 
export interface ProductoService {
    obtenerTodosLosProductos(): Promise<Producto[]>;
    obtenerProductoPorId(id: number): Promise<Producto | null>;
    crearProducto(producto: Producto): Promise<Producto>;
    actualizarProducto(id: number, producto: Producto): Promise<Producto | null>;
    eliminarProducto(id: number): Promise<void>;
}

