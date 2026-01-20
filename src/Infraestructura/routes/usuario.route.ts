import { Router } from 'express';
// IMPORTANTE: Importamos la instancia que YA tiene el servicio inyectado
import { usuarioController } from '../dependencies'; 

const router = Router();

// Definimos las rutas y delegamos al controlador
// Como en el controlador usamos "arrow functions" (createUsuario = async...), 
// no necesitamos hacer .bind(usuarioController)

router.get('/', usuarioController.getUsuarios);
router.get('/:dni', usuarioController.getUsuarioByDNI);
router.post('/', usuarioController.createUsuario); // Crea usuario con nombre, apellidos, dni, pass
router.put('/:dni', usuarioController.updateUsuario);
router.delete('/:dni', usuarioController.deleteUsuario);

export default router;