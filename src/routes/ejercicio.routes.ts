import { Router } from 'express';
import { EjercicioController} from '../controllers/ejercicio.controller';

const router = Router();

router.get('/', EjercicioController.getEjercicios);
router.post('/', EjercicioController.createEjercicio);
router.put('/:id', EjercicioController.updateEjercicio);
router.delete('/:id', EjercicioController.deleteEjercicio);

export default router;
