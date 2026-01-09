import { Producto} from '../models/producto.model';
// Importamos la INTERFAZ que creamos antes, no la clase directamente
import { ProductoRepository as IProductoRepository} from '../repository/producto.repository';

export class ProductoService {
    // CAMBIO CLAVE: El servicio ahora "pide" el repositorio al ser creado
    constructor(private productoRepo: IProductoRepository) {}

    async getAllProductos() {
        // Ahora usamos "this.productoRepo" que viene del constructor
        return await this.productoRepo.getAll();
    }

    async createProducto(data: Producto) {
        // Aquí podríamos poner lógica de negocio extra antes de guardar
        return await this.productoRepo.create(data);
    }

    async updateProducto(id: number, data: Producto) {
        // Verificamos si existe antes (opcional, pero buena práctica)
        const updated = await this.productoRepo.update(id, data);
        if (!updated) {
            throw new Error('Producto no encontrado para actualizar');
        }
        return { id, ...data };
    }

    async deleteProducto(id: number) {
        const deleted = await this.productoRepo.delete(id);
        if (!deleted) {
            throw new Error('Producto no encontrado para eliminar');
        }
        return true;
    }
}