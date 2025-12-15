import db from '../database';
import { User } from '../models/usuario.model';

export class UserRepository { //encapsula las operaciones de la base de datos para usuarios
    
    getAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM usuarios', [], (err, rows: any[]) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    create(user: User): Promise<User> {. //inserta un nuevo usuario
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
            db.run(sql, [user.nombre, user.email], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...user });
            });
        });
    }

    // (Puedes añadir update y delete aquí siguiendo el modelo de productos)
}