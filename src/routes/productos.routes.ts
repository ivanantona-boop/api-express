import { Router } from 'express';
import { ProductoController} from '../controllers/productos.controller';
// Importamos la INSTANCIA minúscula desde el container
import { productoController } from '../container'; 

const router = Router();
router.get('/', productoController.getProductos); // <--- Uso de la instancia
router.post('/', productoController.createProducto);


export default router;