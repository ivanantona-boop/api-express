// src/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../../Apliacacion/services/usuario.service';
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
            // ERROR 500: Error inesperado de base de datos o lógica
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    // GET /api/usuarios/:id
    getUsuarioById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' }); // ERROR 400: Parámetro mal formado
            }

            const usuario = await this.usuarioService.getUsuarioById(id);
            
            if (!usuario) {
                // ERROR 404: El recurso no existe en la base de datos
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(usuario);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // POST /api/usuarios
    createUsuario = async (req: Request, res: Response) => {
        // ERROR 400: Los datos no pasan la validación de Zod
        const result = UsuarioSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ 
                error: 'Datos de usuario inválidos', 
                details: result.error.format() 
            });
        }

        try {
            const newUsuario = await this.usuarioService.createUsuario(result.data);
            res.status(201).json(newUsuario);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // DELETE /api/usuarios/:id
    deleteUsuario = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const existe = await this.usuarioService.getUsuarioById(id);
            
            if (!existe) {
                return res.status(404).json({ error: 'No se puede borrar un usuario que no existe' });
            }

            await this.usuarioService.deleteUsuario(id);
            res.status(204).send(); // 204 significa "Éxito, pero no devuelvo contenido"
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}