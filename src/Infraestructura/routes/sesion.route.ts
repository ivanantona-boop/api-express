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
router.get('/hoy/:idUsuario', sesionController.getSesionHoy); // Para ver el entreno de hoy
router.post('/finalizar/:id', sesionController.finalizarSesion); // Para marcar como terminada


export { router as sesionRouter };
