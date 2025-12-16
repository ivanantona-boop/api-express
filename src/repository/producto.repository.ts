import db from '../database';
import { Product } from '../models/product.model';

export class ProductRepository {
    
    // Obtener todos
    getAll(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM productos', [], (err, rows: any[]) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    // Crear
    create(product: Product): Promise<Product> {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
            // Usamos function normal para acceder a 'this'
            db.run(sql, [product.nombre, product.precio], function(err) {
                if (err) reject(err);
                // Devolvemos el producto con el ID nuevo
                resolve({ id: this.lastID, ...product });
            });
        });
    }

    // Actualizar
    update(id: number, product: Product): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';
            db.run(sql, [product.nombre, product.precio, id], function(err) {
                if (err) reject(err);
                // Resolvemos true si hubo cambios, false si no (ID no existe)
                resolve(this.changes > 0);
            });
        });
    }

    // Borrar
    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM productos WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}