import { Request, Response } from 'express';
import { ProductoService } from '../../Aplicacion/services/producto.service';
import { ProductoSchema } from '../schemas/producto.schema';

export class ProductoController {
  // 1. ELIMINAMOS: const productoService = new ProductoService();

  // 2. AÑADIMOS: El constructor que recibe el servicio
  constructor(private productoService: ProductoService) {}

  // 3. CAMBIAMOS: Las funciones ahora son métodos de la clase
  // Usamos arrow functions ( => ) para que el 'this' no se pierda en Express
  getProductos = async (req: Request, res: Response) => {
    try {
      const productos = await this.productoService.getAllProductos();
      res.json(productos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createProducto = async (req: Request, res: Response) => {
    const result = ProductoSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }
    try {
      const newProducto = await this.productoService.createProducto(result.data);
      res.status(201).json(newProducto);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
