import { IUserRepository } from '../../../domain/repositories/user-repository.interface';

// Caso de uso: listar usuarios.
export class GetAllUsersUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute() {
    // (ISP - Interface Segregation Principle): usamos solo lo que necesitamos del repo.
    return await this.repo.getAll();
  }
}
