import { IProductRepository } from '../../../domain/repositories/product-repository.interface';
import { IdVO } from '../../../domain/value-objects/id.vo';

// Caso de uso: eliminar producto. Permite agregar verificaciones previas o auditoría.
export class DeleteProductUseCase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(id: number) {
    // (VO - Value Object) valida el ID antes de tocar el almacenamiento.
    const productId = IdVO.create(id).value;
    const deleted = await this.repo.delete(productId);
    if (!deleted) {
        throw new Error('Producto no encontrado para eliminar');
    }
    return true;
  }
}
