import { Request, Response } from 'express';
import { EjercicioService } from '../services/ejercicio.service';
import { EjercicioSchema } from '../schemas/ejercicio.schema';

export class EjercicioController {
    // 1. ELIMINAMOS: const ejercicioService = new EjercicioService();

    // 2. AÑADIMOS: El constructor que recibe el servicio
    constructor(private ejercicioService: EjercicioService) {}
    
    // 3. CAMBIAMOS: Las funciones ahora son métodos de la clase
    // Usamos arrow functions ( => ) para que el 'this' no se pierda en Express
    getEjercicios = async (req: Request, res: Response) => {
        try {
            const ejercicios = await this.ejercicioService.getAllEjercicios();
            res.json(ejercicios);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createEjercicio = async (req: Request, res: Response) => {
        const result = EjercicioSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.format() });
            return; 
        }
        try {
            const newEjercicio = await this.ejercicioService.creacionDeEjercicio(result.data);
            res.status(201).json(newEjercicio);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}   

