import { Router } from 'express';
import { usuarioController } from '../../container';

const router = Router();

// Rutas base: /api/usuarios
router.post('/login', usuarioController.login);
router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:nickname', usuarioController.getUsuarioByNickname);
router.put('/:nickname', usuarioController.updateUsuario);
router.delete('/:nickname', usuarioController.deleteUsuario);

export { router as usuarioRouter };
