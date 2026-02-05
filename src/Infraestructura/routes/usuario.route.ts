import { Router } from 'express';
import { usuarioController } from '../../container';

const router = Router();

// Rutas base: /api/usuarios
router.post('/login', usuarioController.login);
router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:dni', usuarioController.getUsuarioByDNI);
router.put('/:dni', usuarioController.updateUsuario);
router.delete('/:dni', usuarioController.deleteUsuario);

export { router as usuarioRouter };
