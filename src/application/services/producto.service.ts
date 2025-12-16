import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { GetAllProductsUseCase } from '../use-cases/productos/get-all-products.usecase';
import { CreateProductUseCase } from '../use-cases/productos/create-product.usecase';
import { UpdateProductUseCase } from '../use-cases/productos/update-product.usecase';
import { DeleteProductUseCase } from '../use-cases/productos/delete-product.usecase';

export class ProductService {
    private readonly productRepo: IProductRepository;
    private readonly getAllProductsUC: GetAllProductsUseCase;
    private readonly createProductUC: CreateProductUseCase;
    private readonly updateProductUC: UpdateProductUseCase;
    private readonly deleteProductUC: DeleteProductUseCase;

    constructor(repo: IProductRepository) {
        this.productRepo = repo;
        // Casos de uso: separan cada acción para crecer reglas sin tocar controlador.
        this.getAllProductsUC = new GetAllProductsUseCase(this.productRepo);
        this.createProductUC = new CreateProductUseCase(this.productRepo);
        this.updateProductUC = new UpdateProductUseCase(this.productRepo);
        this.deleteProductUC = new DeleteProductUseCase(this.productRepo);
    }

    // Capa de dominio/aplicación: aquí van reglas de negocio y orquestación.
    // (DIP - Dependency Inversion Principle): depende de la abstracción IProductRepository.
    // (OCP - Open/Closed Principle): para añadir reglas, extiende casos de uso sin tocar controladores.
    async getAllProducts() {
        return await this.getAllProductsUC.execute();
    }

    async createProduct(data: Product) {
        // Aquí podríamos poner lógica de negocio extra antes de guardar
        return await this.createProductUC.execute(data);
    }

    async updateProduct(id: number, data: Product) {
        // Verificamos si existe antes (opcional, pero buena práctica)
        return await this.updateProductUC.execute(id, data);
    }

    async deleteProduct(id: number) {
        return await this.deleteProductUC.execute(id);
    }
}
