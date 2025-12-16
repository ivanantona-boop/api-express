import db from '../database/database';
import { Product } from '../../domain/models/product.model';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import sqlite3 from 'sqlite3';

export class ProductRepository implements IProductRepository {
    // Capa de infraestructura: encapsula SQL y SQLite.
    // Arquitectura hexagonal: es un adaptador secundario que cumple el puerto IProductRepository.
    // SRP: solo sabe hablar con la base; no aplica reglas de negocio.
    // Si mañana cambias SQLite por otra cosa, toca este archivo, no el servicio (OCP).
    
    // Obtener todos
    getAll(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM productos', [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    // Crear
    create(product: Product): Promise<Product> {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
            // Usamos function normal para acceder a 'this'
            db.run(sql, [product.nombre, product.precio], function(this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                // Devolvemos el producto con el ID nuevo
                resolve({ id: this.lastID, ...product });
            });
        });
    }

    // Actualizar
    update(id: number, product: Product): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';
            db.run(sql, [product.nombre, product.precio, id], function(this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                // Resolvemos true si hubo cambios, false si no (ID no existe)
                resolve(this.changes > 0);
            });
        });
    }

    // Borrar
    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM productos WHERE id = ?';
            db.run(sql, [id], function(this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes > 0);
            });
        });
    }
}
