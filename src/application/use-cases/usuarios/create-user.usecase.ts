import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/models/usuario.model';
import { EmailVO } from '../../../domain/value-objects/email.vo';

// Caso de uso: crear usuario. Aquí es donde crecen las reglas de negocio.
export class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(data: User) {
    const email = EmailVO.create(data.email);
    // Ejemplo de regla: validar email, chequear duplicados, enviar bienvenida, etc.
    // (SRP - Single Responsibility Principle): este caso de uso solo atiende "crear usuario".
    return await this.repo.create({ ...data, email: email.value });
  }
}
