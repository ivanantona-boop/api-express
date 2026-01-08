import { Product } from "../../models/product.model"; 
export interface ProductoService {
    obtenerTodosLosProductos(): Promise<Product[]>;
    obtenerProductoPorId(id: number): Promise<Product | null>;
    crearProducto(producto: Product): Promise<Product>;
    actualizarProducto(id: number, producto: Product): Promise<Producto | null>;
    eliminarProducto(id: number): Promise<void>;
}

