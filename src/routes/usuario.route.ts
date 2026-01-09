import { Router } from 'express';
import { usuarioController } from '../container'; // Importas el objeto ya creado

const router = Router();

// Usas los métodos de la instancia
router.get('/', usuarioController.getUsuarios);
router.post('/', usuarioController.createUsuario);

export default router;