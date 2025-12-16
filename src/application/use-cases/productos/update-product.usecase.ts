import { IProductRepository } from '../../../domain/repositories/product-repository.interface';
import { Product } from '../../../domain/models/product.model';
import { IdVO } from '../../../domain/value-objects/id.vo';

// Caso de uso: actualizar producto. Encapsula reglas de negocio previas a persistir.
export class UpdateProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(id: number, data: Product) {
    // (VO - Value Object) garantiza IDs válidos antes de llegar al repositorio.
    const productId = IdVO.create(id).value;
    const updated = await this.repo.update(productId, data);
    if (!updated) {
      throw new Error('Producto no encontrado para actualizar');
    }
    return { id: productId, ...data };
  }
}
