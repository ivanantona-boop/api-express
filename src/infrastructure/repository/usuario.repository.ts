import db from '../database/database';
import { User } from '../../domain/models/usuario.model';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import sqlite3 from 'sqlite3';

export class UserRepository implements IUserRepository { //encapsula las operaciones de la base de datos para usuarios
    // Mantén esta clase aislada de Express y reglas de negocio.
    // Hexagonal: es un adaptador secundario que implementa el puerto de persistencia IUserRepository.
    
    getAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM usuarios', [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    create(user: User): Promise<User> { //inserta un nuevo usuario
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
            db.run(sql, [user.nombre, user.email], function(this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID, ...user });
            });
        });
    }

    // (Puedes añadir update y delete aquí siguiendo el modelo de productos)
}
