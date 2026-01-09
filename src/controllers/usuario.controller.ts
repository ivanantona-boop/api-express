// src/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioSchema } from '../schemas/usuario.schema';

export class UsuarioController {
    // 1. ELIMINAMOS: const usuarioService = new UsuarioService();
    
    // 2. AÑADIMOS: El constructor que recibe el servicio
    constructor(private usuarioService: UsuarioService) {}

    // 3. CAMBIAMOS: Las funciones ahora son métodos de la clase
    // Usamos arrow functions ( => ) para que el 'this' no se pierda en Express
    getUsuarios = async (req: Request, res: Response) => {
        try {
            const usuarios = await this.usuarioService.getAllUsuarios();
            res.json(usuarios);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createUsuario = async (req: Request, res: Response) => {
        const result = UsuarioSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.format() });
            return; 
        }
        try {
            const newUsuario = await this.usuarioService.createUsuario(result.data);
            res.status(201).json(newUsuario);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}