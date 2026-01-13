import { Ejercicio } from '../../Dominio/models/ejercicio.model';
// Importamos la INTERFAZ que creamos antes, no la clase directamente
import { EjercicioRepository as IEjercicioRepository } from '../../Infraestructura/repository/ejercicio.repository';


export class EjercicioService {
    // CAMBIO CLAVE: El servicio ahora "pide" el repositorio al ser creado
    constructor(private ejercicioRepo: IEjercicioRepository) {}

    async getAllEjercicios(): Promise<Ejercicio[]> {
        return await this.ejercicioRepo.getAllEjercicios();
    }

    async creacionDeEjercicio(data: Ejercicio): Promise<Ejercicio> {
        // Aquí podríamos poner lógica de negocio extra antes de guardar
        return await this.ejercicioRepo.createEjercicio(data);
    }
    
    async actualizarEjercicio(id: number, data: Ejercicio): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepo.updateEjercicio(id, data);
    if (!ejercicio) {
        throw new Error('Ejercicio no encontrado');
    }
    return ejercicio;
}

    async eliminarEjercicio(id: number): Promise<void> {
        return await this.ejercicioRepo.deleteEjercicio(id);
    }
}
