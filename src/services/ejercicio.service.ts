import { EjercicioRepository } from "../repository/ejercicio.repository";
import { Ejercicio } from "../models/ejercicio.model";
import { promises } from "dns";

//instancio el repositorio para usar sus métodos
const ejercicioRepo = new EjercicioRepository();

export class EjercicioService {

    async getAllEjercicios(): Promise<Ejercicio[]> {
        return await ejercicioRepo.getAllEjercicios();
    }

    async creacionDeEjercicio(data: Ejercicio): Promise<Ejercicio> {
        // Aquí podríamos poner lógica de negocio extra antes de guardar
        return await ejercicioRepo.createEjercicio(data);
    }
    
    async actualizarEjercicio(id: number, data: Ejercicio): Promise<Ejercicio | null> {
        // Aquí podríamos poner lógica de negocio extra antes de actualizar
        return await ejercicioRepo.updateEjercicio(id, data);
    }

    async eliminarEjercicio(id: number): Promise<void> {
        return await ejercicioRepo.deleteEjercicio(id);
    }
}
