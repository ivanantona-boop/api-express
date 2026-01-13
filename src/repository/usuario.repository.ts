import { Database } from 'sqlite3';
import { Usuario } from '../models/usuario.model';
import { UsuarioRepository as IUsuarioRepository } from '../interfaces/usuario/usuario.repository.interface';

/**
 * Esta clase se encarga exclusivamente de las consultas SQL a la base de datos.
 * Implementa la interfaz IUsuarioRepository para garantizar que cumple con el contrato
 * esperado por los servicios.
 */
export class UsuarioRepository implements IUsuarioRepository {
    
    /**
     * INYECCIÓN DE DEPENDENCIA:
     * Al recibir 'db' en el constructor, permitimos que el repositorio sea flexible.
     * - En producción: Recibirá la base de datos real (archivo .db).
     * - En tests: Recibirá una base de datos en memoria (:memory:).
     */
    constructor(private db: Database) {}

    /**
     * Obtiene todos los usuarios de la tabla.
     */
    getAll(): Promise<Usuario[]> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuarios';
            this.db.all(sql, [], (err, rows: Usuario[]) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    /**
     * Busca un usuario específico por su ID único.
     */
    getById(id: number): Promise<Usuario | null> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuarios WHERE id = ?';
            this.db.get(sql, [id], (err, row: Usuario) => {
                if (err) return reject(err);
                resolve(row || null); // Retorna null si no encuentra nada
            });
        });
    }

    /**
     * Inserta un nuevo usuario en la base de datos.
     * Valida que la sintaxis del INSERT y los nombres de columnas sean correctos.
     */
    create(usuario: Usuario): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (nombre, email, apellidos, contraseña) VALUES (?, ?, ?, ?)';
            
            // Usamos una función tradicional (function) en el callback para poder acceder a 'this.lastID'
            this.db.run(sql, 
                [usuario.nombre, usuario.email, usuario.apellidos, usuario.contraseña], 
                function(err) {
                    if (err) return reject(err);
                    // 'this.lastID' es una propiedad de sqlite3 que devuelve el ID generado automáticamente
                    resolve({ id: this.lastID, ...usuario });
                }
            );
        });
    }

    /**
     * Actualiza los datos de un usuario existente.
     * Retorna el usuario actualizado o null si el ID no existía.
     */
    update(id: number, usuario: Usuario): Promise<Usuario | null> {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuarios SET nombre = ?, email = ?, apellidos = ?, contraseña = ? WHERE id = ?';
            
            this.db.run(sql, 
                [usuario.nombre, usuario.email, usuario.apellidos, usuario.contraseña, id], 
                function(err) {
                    if (err) return reject(err);
                    // 'this.changes' indica cuántas filas fueron afectadas por la operación
                    if (this.changes === 0) return resolve(null);
                    resolve({ id, ...usuario });
                }
            );
        });
    }

    /**
     * Elimina un usuario de la base de datos por su ID.
     */
    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM usuarios WHERE id = ?';
            this.db.run(sql, [id], (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }
}