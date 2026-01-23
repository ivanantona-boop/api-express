import { Request, Response } from 'express';
import { UsuarioService } from '../../Aplicacion/services/usuario.service';
import { UsuarioSchema } from '../schemas/usuario.schema';

export class UsuarioController {
  // INYECCIÓN DE DEPENDENCIA:
  // El controlador recibe el servicio ya montado. No lo crea él mismo.
  constructor(private readonly usuarioService: UsuarioService) {}

  // Usamos arrow functions para no perder el contexto de 'this'
  createUsuario = async (req: Request, res: Response) => {
    // 1. Validar entrada con Zod
    const validacion = UsuarioSchema.safeParse(req.body);
    if (!validacion.success) {
      return res.status(400).json({ error: validacion.error.issues });
    }

    try {
      // 2. Llamar al servicio
      const nuevoUsuario = await this.usuarioService.registrarUsuario(validacion.data);
      res.status(201).json(nuevoUsuario);
    } catch (error: any) {
      console.error(error);
      // Manejo básico de errores
      if (error.message.includes('ya existe')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  getUsuarios = async (req: Request, res: Response) => {
    try {
      const usuarios = await this.usuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  };

  getUsuarioByDNI = async (req: Request, res: Response) => {
    const { dni } = req.params;
    try {
      const usuario = await this.usuarioService.obtenerPorDNI(dni);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar usuario' });
    }
  };

  updateUsuario = async (req: Request, res: Response) => {
    const { dni } = req.params;
    try {
      // Permitimos actualización parcial (partial())
      const validacion = UsuarioSchema.partial().safeParse(req.body);
      if (!validacion.success) {
        return res.status(400).json({ error: validacion.error.issues });
      }

      const actualizado = await this.usuarioService.actualizarUsuario(dni, validacion.data);
      if (!actualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
      }
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar' });
    }
  };

  deleteUsuario = async (req: Request, res: Response) => {
    const { dni } = req.params;
    try {
      const eliminado = await this.usuarioService.eliminarUsuario(dni);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  };
}
