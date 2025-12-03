import { Router } from 'express';
// Fíjate en dos cosas:
// 1. La ruta termina en usuario.controller (singular, como tu archivo)
// 2. La función es getUsuarios (plural, como la definimos en el código anterior)

import { getUsuarios, createUsuario } from '../controllers/usuario.controller';

const router = Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);

export default router;