import { Router } from 'express';
import { 
    getProductos, 
    createProducto, 
    updateProducto, 
    deleteProducto 
} from '../controllers/productos.controller';

const router = Router();

// Capa de infraestructura (routing HTTP): conecta URLs con el controlador.
// (OCP - Open/Closed Principle): si agregas nuevas acciones, define la ruta aquí sin romper las existentes.
// Rutas sin ID
router.get('/', getProductos);
router.post('/', createProducto);

// Rutas con ID (para editar o borrar uno específico)
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;
