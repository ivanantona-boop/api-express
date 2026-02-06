import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { UsuarioSchema } from '../schemas/usuario.schema';
import { UsuarioService } from '../../Aplicacion/services/usuario.service';

export class UsuarioController {
  // inyección del servicio fachada que gestiona los casos de uso
  constructor(private readonly usuarioService: UsuarioService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { nickname, contrasena } = req.body;

      // validación básica de presencia de campos
      if (!nickname || !contrasena) {
        return res.status(400).json({ error: 'faltan datos de acceso' });
      }

      // recuperación del usuario utilizando el servicio de búsqueda por nickname
      const usuario = await this.usuarioService.obtenerPorNickname(nickname);

      if (!usuario) {
        return res.status(404).json({ error: 'usuario no encontrado' });
      }

      // verificación de contraseña
      // forzamos el tipado a any temporalmente para acceder a la contraseña si el modelo es estricto
      if ((usuario as any).contrasena !== contrasena) {
        return res.status(401).json({ error: 'contraseña incorrecta' });
      }

      // respuesta exitosa devolviendo los datos del usuario
      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error durante el proceso de login' });
    }
  };

  createUsuario = async (req: Request, res: Response) => {
    try {
      // validación estricta con parse. si los datos son inválidos, lanza una excepción zoderror inmediatamente
      const datos = UsuarioSchema.parse(req.body);

      // llamada al servicio para registrar el nuevo usuario
      // usamos 'as any' para adaptar el tipo inferido de zod al modelo de dominio esperado por el servicio
      const nuevo = await this.usuarioService.registrarUsuario(datos as any);

      res.status(201).json(nuevo);
    } catch (error: any) {
      console.error(error);

      // manejo de errores de validación de datos (zod)
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues });
      }

      // manejo específico para errores de duplicidad (nickname ya registrado)
      if (error.message && error.message.includes('existe')) {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: 'error interno al crear usuario' });
    }
  };

  getUsuarios = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para recuperar el listado completo
      const usuarios = await this.usuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener el listado de usuarios' });
    }
  };

  getUsuarioByNickname = async (req: Request, res: Response) => {
    try {
      // extracción del nickname desde los parámetros de la url
      const { nickname } = req.params;

      // búsqueda del usuario específico
      const usuario = await this.usuarioService.obtenerPorNickname(nickname);

      if (!usuario) {
        return res.status(404).json({ error: 'usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al buscar usuario' });
    }
  };

  updateUsuario = async (req: Request, res: Response) => {
    try {
      // validación parcial permitiendo enviar solo los campos que se desean modificar
      const datos = UsuarioSchema.partial().parse(req.body);

      // llamada al servicio de actualización usando el nickname como identificador
      // usamos 'as any' para compatibilidad de tipos entre zod y el modelo de dominio
      const actualizado = await this.usuarioService.actualizarUsuario(
        req.params.nickname,
        datos as any,
      );

      if (!actualizado) {
        return res.status(404).json({ error: 'usuario no encontrado para actualizar' });
      }
      res.json(actualizado);
    } catch (error: any) {
      console.error(error);

      // manejo de errores de validación de datos
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues });
      }

      res.status(500).json({ error: 'error al actualizar usuario' });
    }
  };

  deleteUsuario = async (req: Request, res: Response) => {
    try {
      // llamada al servicio para eliminar el registro usando el nickname de la url
      const eliminado = await this.usuarioService.eliminarUsuario(req.params.nickname);

      if (!eliminado) {
        return res.status(404).json({ error: 'usuario no encontrado para eliminar' });
      }
      res.json({ message: 'usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar usuario' });
    }
  };
}
