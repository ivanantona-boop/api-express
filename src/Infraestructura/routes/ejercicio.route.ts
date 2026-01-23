import { Router } from 'express';
import { ejercicioController } from '../../container';

const router = Router();

// Rutas base: /api/ejercicios
router.post('/', ejercicioController.createEjercicio);
router.get('/', ejercicioController.getEjercicios);
router.get('/:id', ejercicioController.getEjercicioById);
router.delete('/:id', ejercicioController.deleteEjercicio);

export { router as ejercicioRouter };
