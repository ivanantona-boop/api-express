import { User } from '../models/usuario.model';

// Puerto de persistencia para usuarios (DIP - Dependency Inversion Principle).
// En hexagonal es el contrato que cumplen los adaptadores de BD.
export interface IUserRepository {
  getAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  // Agrega update/delete cuando se necesiten.
}
