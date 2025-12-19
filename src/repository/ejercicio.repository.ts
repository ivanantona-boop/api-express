import db from '../database';
import { Ejercicio } from '../models/ejercicio.model';

export class EjercicioRepository {
    async getAllEjercicios(): Promise<Ejercicio[]> {
        const [rows] = await db.query('SELECT * FROM ejercicios');
        return rows;
    }

    async getEjercicioById(id: number): Promise<Ejercicio | null> {
        const [rows] = await db.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async getEjercicioByName(nombre: string): Promise<Ejercicio | null> {
        const [rows] = await db.query('SELECT * FROM ejercicios WHERE nombre = ?', [nombre]);
        return rows[0] || null;
    }

    async createEjercicio(ejercicio: Ejercicio): Promise<Ejercicio> {
        const [result] = await db.query('INSERT INTO ejercicios SET ?', [ejercicio]);
        return { id: result.insertId, ...ejercicio };
    }

    async updateEjercicio(id: number, ejercicio: Ejercicio): Promise<Ejercicio | null> {
        await db.query('UPDATE ejercicios SET ? WHERE id = ?', [ejercicio, id]);
        return this.getEjercicioById(id);
    }

    async deleteEjercicio(id: number): Promise<void> {
        await db.query('DELETE FROM ejercicios WHERE id = ?', [id]);
    }
}
