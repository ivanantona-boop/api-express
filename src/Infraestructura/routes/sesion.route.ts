import { Router } from 'express';
import { sesionController } from '../../container';

const router = Router();

// Rutas base: /api/sesiones
router.post('/', sesionController.createSesionApp);
// Ruta especial: Obtener todas las sesiones de un plan concreto
router.get('/plan/:idPlan', sesionController.getSesionesByPlan);
router.get('/:id', sesionController.getSesionById);
router.put('/:id', sesionController.updateSesion);
router.delete('/:id', sesionController.deleteSesion);

export { router as sesionRouter };
