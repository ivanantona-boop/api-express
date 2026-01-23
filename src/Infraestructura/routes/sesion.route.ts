import { Router } from 'express';
import { sesionController } from '../../container';

const router = Router();

// Rutas base: /api/sesiones
router.post('/', sesionController.createSesion);
router.get('/:id', sesionController.getSesionById);
router.put('/:id', sesionController.updateSesion);
router.delete('/:id', sesionController.deleteSesion);

// Ruta especial: Obtener todas las sesiones de un plan concreto
router.get('/plan/:idPlan', sesionController.getSesionesByPlan);

export { router as sesionRouter };
