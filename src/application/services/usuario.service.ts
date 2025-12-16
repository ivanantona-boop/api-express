import { User } from '../../domain/models/usuario.model';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { GetAllUsersUseCase } from '../use-cases/usuarios/get-all-users.usecase';
import { CreateUserUseCase } from '../use-cases/usuarios/create-user.usecase';

export class UserService {
    private readonly userRepo: IUserRepository;
    private readonly getAllUsersUC: GetAllUsersUseCase;
    private readonly createUserUC: CreateUserUseCase;

    constructor(repo: IUserRepository) { //instanciando el repositorio para poder usar sus métodos (getAll, create)
        this.userRepo = repo;
        this.getAllUsersUC = new GetAllUsersUseCase(this.userRepo);
        this.createUserUC = new CreateUserUseCase(this.userRepo);
    }

    // Punto ideal para reglas de negocio: validaciones, políticas, etc.
    // (SRP - Single Responsibility Principle): el controlador no debería contener esto.
    // (DIP - Dependency Inversion Principle): la dependencia real se inyecta desde fuera.
    async getAllUsers() {
        return await this.getAllUsersUC.execute();
    }

    async createUser(data: User) {
        // Aquí podrías validar si el email ya existe, por ejemplo.
        return await this.createUserUC.execute(data);
    }
}
