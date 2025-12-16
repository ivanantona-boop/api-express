import { Router } from 'express'; // permite crear un minigrupo de rutas aisladas
// Fíjate en dos cosas:
// 1. La ruta termina en usuario.controller (singular, como tu archivo)
// 2. La función es getUsuarios (plural, como la definimos en el código anterior)

import { getUsuarios, createUsuario } from '../controllers/usuario.controller';

const router = Router();

// Punto de entrada HTTP: solo declara rutas; no hagas lógica aquí (SRP - Single Responsibility Principle).
// Si sumas endpoints (PUT/DELETE), agrégalos aquí y deja la lógica en controlador/servicio.
router.get('/', getUsuarios);
router.post('/', createUsuario);

export default router;
