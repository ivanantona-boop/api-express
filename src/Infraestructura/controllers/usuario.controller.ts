import { Request, Response } from 'express';
import { UsuarioSchema } from '../schemas/usuario.schema';
import { UsuarioService } from '../../Aplicacion/services/usuario.service';

export class UsuarioController {
  // inyección del servicio fachada que contiene los casos de uso
  constructor(private readonly usuarioService: UsuarioService) {}

  createUsuario = async (req: Request, res: Response) => {
    // validación de datos con zod
    const validacion = UsuarioSchema.safeParse(req.body);
    if (!validacion.success) return res.status(400).json({ error: validacion.error.issues });

    try {
      // llamada al servicio para registrar el usuario
      const nuevo = await this.usuarioService.registrarUsuario(validacion.data);
      res.status(201).json(nuevo);
    } catch (error: any) {
      console.error(error);
      // manejo específico de error de duplicidad
      if (error.message.includes('existe')) return res.status(409).json({ error: error.message });
      res.status(500).json({ error: 'error interno' });
    }
  };

  getUsuarios = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para obtener todos los usuarios
      const usuarios = await this.usuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener usuarios' });
    }
  };

  getUsuarioByDNI = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para buscar por dni
      const usuario = await this.usuarioService.obtenerPorDNI(req.params.dni);

      if (!usuario) return res.status(404).json({ error: 'usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al buscar usuario' });
    }
  };

  updateUsuario = async (req: Request, res: Response) => {
    try {
      // validación parcial de los datos a actualizar
      const validacion = UsuarioSchema.partial().safeParse(req.body);
      if (!validacion.success) return res.status(400).json({ error: validacion.error.issues });

      // llamada al servicio para actualizar
      const actualizado = await this.usuarioService.actualizarUsuario(
        req.params.dni,
        validacion.data,
      );

      if (!actualizado) return res.status(404).json({ error: 'usuario no encontrado' });
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al actualizar' });
    }
  };

  deleteUsuario = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para eliminar
      const eliminado = await this.usuarioService.eliminarUsuario(req.params.dni);

      if (!eliminado) return res.status(404).json({ error: 'usuario no encontrado' });
      res.json({ message: 'usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar' });
    }
  };
}
