import { Router } from 'express';
import { ejercicioController} from '../container'; // Importas el objeto ya creado

const router = Router();

router.get('/', ejercicioController.getEjercicios);
router.post('/', ejercicioController.createEjercicio);
router.put('/:id', ejercicioController.updateEjercicio);
router.delete('/:id', ejercicioController.deleteEjercicio);

export default router;
