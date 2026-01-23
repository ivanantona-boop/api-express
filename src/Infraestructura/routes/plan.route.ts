import { Router } from 'express';
import { planController } from '../../container';

const router = Router();

// Rutas base: /api/planes
router.post('/', planController.createPlan);
router.get('/:id', planController.getPlanById);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

// Ruta especial: Obtener todos los planes de un usuario concreto
router.get('/usuario/:idUsuario', planController.getPlanesByUsuario);

export { router as planRouter };
