import { Ejercicio } from '../models/ejercicio.model';

/**
 * REPOSITORIO MOCK (SIMULADO)
 * Esta clase actúa como si fuera una base de datos real, pero guarda todo
 * en la memoria RAM (en una lista), por lo que es ideal para pruebas rápidas.
 */
export class EjercicioMockRepository {
    
    // 1. Nuestra "Base de Datos" temporal: una lista de ejercicios vacía
    private listaEjercicios: Ejercicio[] = [];

    // 2. Un contador para los IDs: empieza en 0 y subirá de 1 en 1 (como un autoincrement)
    private contadorId = 0;

    /**
     * Devuelve todos los ejercicios que tenemos guardados.
     */
    async getAllEjercicios(): Promise<Ejercicio[]> {
        // Devolvemos una copia de la lista para que nadie la rompa desde fuera
        return [...this.listaEjercicios];
    }

    /**
     * Busca un ejercicio por su ID.
     */
    async getEjercicioById(id: number): Promise<Ejercicio | null> {
        // Buscamos en la lista el ejercicio que coincida con el ID
        const encontrado = this.listaEjercicios.find(e => e.id === id);
        
        // Si no lo encuentra, JS devuelve 'undefined', nosotros devolvemos 'null' por contrato
        return encontrado || null;
    }

    /**
     * Crea un nuevo ejercicio y le asigna un ID automático.
     */
    async createEjercicio(ejercicio: Ejercicio): Promise<Ejercicio> {
        // Aumentamos el contador para que el ID sea único (1, 2, 3...)
        this.contadorId++;

        // Creamos un nuevo objeto combinando el ID nuevo con los datos recibidos
        const nuevo = { ...ejercicio, id: this.contadorId };

        // Lo guardamos en nuestra lista
        this.listaEjercicios.push(nuevo);

        return nuevo;
    }

    /**
     * Busca un ejercicio por ID y cambia sus datos.
     */
    async updateEjercicio(id: number, datosNuevos: Ejercicio): Promise<Ejercicio | null> {
        // Buscamos si existe el ejercicio primero
        const existe = this.listaEjercicios.some(e => e.id === id);
        
        if (!existe) return null; // Si no existe, no hacemos nada

        // Actualizamos la lista: mantenemos los que no coinciden y reemplazamos el que sí
        this.listaEjercicios = this.listaEjercicios.map(e => 
            e.id === id ? { ...datosNuevos, id } : e
        );

        return { ...datosNuevos, id };
    }

    /**
     * Elimina el ejercicio de la lista según su ID.
     */
    async deleteEjercicio(id: number): Promise<void> {
        // Sobreescribimos la lista dejando solo los ejercicios que NO tengan ese ID
        // Es la forma más sencilla de "borrar" en JavaScript
        this.listaEjercicios = this.listaEjercicios.filter(e => e.id !== id);
    }
}