import { IProductRepository } from '../../../domain/repositories/product-repository.interface';

// Caso de uso: obtener todos los productos.
export class GetAllProductsUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute() {
    // (ISP - Interface Segregation Principle): el caso de uso solo requiere el método que usa del repo.
    return await this.repo.getAll();
  }
}
