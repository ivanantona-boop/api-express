import { ProductRepository } from '../repository/producto.repository';
import { Product } from '../models/product.model';

// Instanciamos el repositorio
const productRepo = new ProductRepository();

export class ProductService {

    async getAllProducts() {
        return await productRepo.getAll();
    }

    async createProduct(data: Product) {
        // Aquí podríamos poner lógica de negocio extra antes de guardar
        return await productRepo.create(data);
    }

    async updateProduct(id: number, data: Product) {
        // Verificamos si existe antes (opcional, pero buena práctica)
        const updated = await productRepo.update(id, data);
        if (!updated) {
            throw new Error('Producto no encontrado para actualizar');
        }
        return { id, ...data };
    }

    async deleteProduct(id: number) {
        const deleted = await productRepo.delete(id);
        if (!deleted) {
            throw new Error('Producto no encontrado para eliminar');
        }
        return true;
    }
}