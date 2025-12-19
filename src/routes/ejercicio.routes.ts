import { Router } from 'express';
import { 
    getEjercicios, 
    creacionDeEjercicio,
    actualizarEjercicio,
    eliminarEjercicio 
} from '../controllers/ejercicio.controller';

const router = Router();

router.get('/', getEjercicios);
router.post('/', creacionDeEjercicio);
router.put('/:id', actualizarEjercicio);
router.delete('/:id', eliminarEjercicio);

export default router;
