import { Request, Response } from 'express';
import { ProductService } from '../services/producto.services';
import { ProductoSchema } from '../schemas/producto.schema';

const productService = new ProductService();

export const getProductos = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createProducto = async (req: Request, res: Response) => {
    // 1. Zod valida la entrada HTTP
    const result = ProductoSchema.safeParse(req.body);
    
    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return; 
    }

    try {
        // 2. El servicio hace el trabajo sucio
        const newProduct = await productService.createProduct(result.data);
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = ProductoSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return;
    }

    try {
        // Convertimos id a numero porque viene como string en la URL
        const updatedProduct = await productService.updateProduct(Number(id), result.data);
        res.json(updatedProduct);
    } catch (error: any) {
        // Si el servicio lanza error de "No encontrado", devolvemos 404
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const deleteProducto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await productService.deleteProduct(Number(id));
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error: any) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};