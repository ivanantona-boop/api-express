import { IProductRepository } from '../../../domain/repositories/product-repository.interface';
import { Product } from '../../../domain/models/product.model';

// Caso de uso: crear producto. Aquí puedes agregar reglas antes de persistir.
export class CreateProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(data: Product) {
    // (SRP - Single Responsibility Principle): un caso de uso = un flujo de negocio.
    // Ejemplo: aquí podrías validar duplicados o aplicar descuentos antes de persistir.
    return await this.repo.create(data);
  }
}
