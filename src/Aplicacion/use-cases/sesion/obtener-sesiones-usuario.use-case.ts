export class ObtenerSesionesUsuarioUseCase {
  constructor(private readonly repository: any) {} // Luego lo tipas con tu interfaz si la tienes

  async execute(idUsuario: string) {
    // Esta es la llamada al repositorio que buscará en la colección de sesiones
    return await this.repository.findSesionesByUsuario(idUsuario);
  }
}
