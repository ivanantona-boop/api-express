import { Request, Response } from 'express';
import db from '../database';
import { ProductoSchema } from '../schemas/producto.schema';

// 1. OBTENER todos los productos
export const getProductos = (req: Request, res: Response) => {
    const sql = 'SELECT * FROM productos';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            mensaje: 'Lista de productos',
            data: rows
        });
    });
};

// 2. CREAR un producto (Validado con Zod)
export const createProducto = (req: Request, res: Response) => {
    // Validamos los datos antes de hacer nada
    const result = ProductoSchema.safeParse(req.body);

    if (!result.success) {
        // Si falla, devolvemos el error y paramos
        res.status(400).json({ error: result.error.format() });
        return; 
    }

    const { nombre, precio } = result.data;
    const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
    
    db.run(sql, [nombre, precio], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({
            mensaje: 'Producto guardado exitosamente',
            id: this.lastID,
            producto: { nombre, precio }
        });
    });
};

// 3. ACTUALIZAR un producto (Validado con Zod)
export const updateProducto = (req: Request, res: Response) => {
    const { id } = req.params;

    // También validamos los datos al actualizar
    const result = ProductoSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return;
    }

    const { nombre, precio } = result.data;
    const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';

    db.run(sql, [nombre, precio, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
             res.status(404).json({ error: 'Producto no encontrado' });
             return;
        }
        res.json({
            mensaje: 'Producto actualizado',
            producto: { id, nombre, precio }
        });
    });
};

// 4. BORRAR un producto
export const deleteProducto = (req: Request, res: Response) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    });
};