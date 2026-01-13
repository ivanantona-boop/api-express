import { Database } from 'sqlite3';
import { Ejercicio } from '../../Dominio/models/ejercicio.model';

export class EjercicioRepository {
    constructor(private db: Database) {}

    getAllEjercicios(): Promise<Ejercicio[]> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM ejercicios', [], (err, rows: Ejercicio[]) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getEjercicioById(id: number): Promise<Ejercicio | null> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM ejercicios WHERE id = ?', [id], (err, row: Ejercicio) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    createEjercicio(ejercicio: Ejercicio): Promise<Ejercicio> {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ejercicios (nombre, descripcion) VALUES (?, ?)';
            const params = [ejercicio.nombre, ejercicio.descripcion];
            this.db.run(sql, params, function(err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, ...ejercicio });
            });
        });
    }

    updateEjercicio(id: number, ejercicio: Ejercicio): Promise<Ejercicio | null> {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE ejercicios SET nombre = ?, descripcion = ? WHERE id = ?';
            const params = [ejercicio.nombre, ejercicio.descripcion, id];
            this.db.run(sql, params, function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                resolve({ id, ...ejercicio });
            });
        });
    }

    deleteEjercicio(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM ejercicios WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}