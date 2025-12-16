import { UserRepository } from '../repository/usuario.repository';
import { User } from '../models/usuario.model';

const userRepo = new UserRepository(); //instanciando el repositorio para poder usar sus métodos (getAll, create)

export class UserService {
    async getAllUsers() {
        return await userRepo.getAll();
    }

    async createUser(data: User) {
        // Aquí podrías validar si el email ya existe, por ejemplo.
        return await userRepo.create(data);
    }
}