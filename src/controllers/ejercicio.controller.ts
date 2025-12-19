import { Request, Response } from 'express';
import { EjercicioService } from '../services/ejercicio.service';
import { EjercicioSchema } from '../schemas/ejercicio.schema';

//instancio el servicio de ejercicio, para poder acceder a sus metodos
const ejercicioService = new EjercicioService();

//export se usa para que otras partes de la app puedan usar estas funciones
export const getEjercicios = async (req: Request, res: Response) => {
    try {
        const ejercicios = await ejercicioService.getAllEjercicios();
        res.json(ejercicios);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
export const creacionDeEjercicio = async (req: Request, res: Response) => {
    // 1. Zod valida la entrada HTTP
    // EjercicioSchema --> esquema de validación importado, son las reglas definidas
    // safeParse intenta validar req.body contra esas reglas
    // req.body --> datos enviados en la petición HTTP (POST)
    const resultado = EjercicioSchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({ error: resultado.error.format() });
        return; 
    }

    try {
        //2. se envian datos validos al servicio
        //res.status --> 
        //201 --> creado exitosamente
        //500 --> error del servidor
        // status(nº) --> establece el código de estado HTTP de la respuesta
        const nuevoEjercicio = await ejercicioService.creacionDeEjercicio(resultado.data);
        res.status(201).json(nuevoEjercicio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEjercicio = async (req: Request, res: Response) => {
    const { id } = req.params;
    const resultado = EjercicioSchema.safeParse(req.body);
    if (!resultado.success) {
        res.status(400).json({ error: resultado.error.format() });
        return;
    }
    try {
        const ejercicioActualizado = await ejercicioService.actualizarEjercicio(Number(id), resultado.data);
        res.json(ejercicioActualizado);
    } catch (error: any) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
// Eliminar ejercicio por ID
// {id} se obtiene de los parámetros de la URL
// Por ejemplo, DELETE /ejercicios/3 tendría id=3
// url sacada de req.params
// req: petición HTTP entrante. req.params contiene parámetros de ruta
export const eliminarEjercicio = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await ejercicioService.eliminarEjercicio(Number(id));
        res.status(204).send();
    } catch (error: any) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
