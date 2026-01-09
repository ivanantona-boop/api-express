import { Router } from 'express';
import { ProductoController} from '../controllers/productos.controller';

const router = Router();
router.get('/', ProductoController.getProductos);
router.post('/', ProductoController.createProducto);


export default router;