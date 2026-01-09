import db from '../database';
import { Usuario } from '../models/usuario.model';

export class UsuarioRepository { //encapsula las operaciones de la base de datos para usuarios
    
    getAll(): Promise<Usuario[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM usuarios', [], (err, rows: any[]) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    create(usuario: Usuario): Promise<Usuario> { //inserta un nuevo usuario
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (nombre, email, apellidos, contraseña) VALUES (?, ?, ?, ?)';
            db.run(sql, [usuario.nombre, usuario.email, usuario.apellidos, usuario.contraseña], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...usuario });
            });
        });
    }

    update(id: number, usuario: Usuario): Promise<Usuario | null> {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuarios SET nombre = ?, email = ?, apellidos = ?, contraseña = ? WHERE id = ?';
            db.run(sql, [usuario.nombre, usuario.email, usuario.apellidos, usuario.contraseña, id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0 ? { id, ...usuario } : null);
            });
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM usuarios WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) reject(err);
                resolve();
            });
        });
    }

}