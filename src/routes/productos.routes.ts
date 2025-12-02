import { Router } from 'express';
import { 
    getProductos, 
    createProducto, 
    updateProducto, 
    deleteProducto 
} from '../controllers/productos.controller';

const router = Router();

// Rutas sin ID
router.get('/', getProductos);
router.post('/', createProducto);

// Rutas con ID (para editar o borrar uno específico)
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;