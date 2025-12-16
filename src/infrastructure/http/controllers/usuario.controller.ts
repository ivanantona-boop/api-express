import { Request, Response } from 'express';
import { UserService } from '../../../application/services/usuario.service';
import { UsuarioSchema } from '../schemas/usuario.schema';
import { UserRepository } from '../../repository/usuario.repository';

// Adaptador HTTP: recibe peticiones y llama a casos de uso.
// (SRP - Single Responsibility Principle): no debe contener reglas de negocio.
// (DIP - Dependency Inversion Principle): recibe un repositorio concreto para poder cambiarlo sin tocar el controlador.
const userService = new UserService(new UserRepository());

// Adaptador HTTP: sigue SRP separando transporte (Express) de negocio (servicio).
// Si mañana hay otra entrada (CLI, cola), agregamos otro adaptador sin tocar el servicio (OCP).
export const getUsuarios = async (req: Request, res: Response) => { //recibe la petición y responde con la lista de usuarios
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createUsuario = async (req: Request, res: Response) => {
    const result = UsuarioSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return; 
    }
    try {
        const newUser = await userService.createUser(result.data);
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.message.includes('Email inválido')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
