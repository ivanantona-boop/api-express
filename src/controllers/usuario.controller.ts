import { Request, Response } from 'express';
import { UserService } from '../services/usuario.service';
import { UsuarioSchema } from '../schemas/usuario.schema';

const userService = new UserService();

export const getUsuarios = async (req: Request, res: Response) => {
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
        res.status(500).json({ error: error.message });
    }
};