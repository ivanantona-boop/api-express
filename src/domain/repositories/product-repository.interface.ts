import { Product } from '../models/product.model';

// Puerto de persistencia para productos (DIP - Dependency Inversion Principle).
// En arquitectura hexagonal esto es un puerto secundario que implementan los adaptadores de infraestructura.
export interface IProductRepository {
  getAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: number, product: Product): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
