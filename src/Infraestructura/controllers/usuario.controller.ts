import { Request, Response } from 'express';
import { UsuarioSchema } from '../schemas/usuario.schema';

// Imports de Use Cases
import { CrearUsuarioUseCase } from '../../Aplicacion/use-cases/usuario/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../../Aplicacion/use-cases/usuario/listar-usuarios.use-case';
import { BuscarUsuarioPorDniUseCase } from '../../Aplicacion/use-cases/usuario/buscar-usuario-por-dni.use-case';
import { ActualizarUsuarioUseCase } from '../../Aplicacion/use-cases/usuario/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from '../../Aplicacion/use-cases/usuario/eliminar-usuario.use-case';

export class UsuarioController {
  constructor(
    private readonly crearUsuarioUseCase: CrearUsuarioUseCase,
    private readonly listarUsuariosUseCase: ListarUsuariosUseCase,
    private readonly buscarUsuarioPorDniUseCase: BuscarUsuarioPorDniUseCase,
    private readonly actualizarUsuarioUseCase: ActualizarUsuarioUseCase,
    private readonly eliminarUsuarioUseCase: EliminarUsuarioUseCase,
  ) {}

  createUsuario = async (req: Request, res: Response) => {
    const validacion = UsuarioSchema.safeParse(req.body);
    if (!validacion.success) return res.status(400).json({ error: validacion.error.issues });

    try {
      const nuevo = await this.crearUsuarioUseCase.execute(validacion.data);
      res.status(201).json(nuevo);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes('existe')) return res.status(409).json({ error: error.message });
      res.status(500).json({ error: 'Error interno' });
    }
  };

  getUsuarios = async (req: Request, res: Response) => {
    try {
      const usuarios = await this.listarUsuariosUseCase.execute();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  };

  getUsuarioByDNI = async (req: Request, res: Response) => {
    try {
      const usuario = await this.buscarUsuarioPorDniUseCase.execute(req.params.dni);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar usuario' });
    }
  };

  updateUsuario = async (req: Request, res: Response) => {
    try {
      const validacion = UsuarioSchema.partial().safeParse(req.body);
      if (!validacion.success) return res.status(400).json({ error: validacion.error.issues });

      const actualizado = await this.actualizarUsuarioUseCase.execute(
        req.params.dni,
        validacion.data,
      );
      if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar' });
    }
  };

  deleteUsuario = async (req: Request, res: Response) => {
    try {
      const eliminado = await this.eliminarUsuarioUseCase.execute(req.params.dni);
      if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
