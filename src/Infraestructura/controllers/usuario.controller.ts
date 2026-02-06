import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { UsuarioSchema } from '../schemas/usuario.schema';

// 1. Imports de Servicios y Casos de Uso
import { UsuarioService } from '../../Aplicacion/services/usuario.service';
import { ListarClientesUseCase } from '../../Aplicacion/use-cases/usuario/listar-clientes.use-case'; // Asegúrate que la ruta acaba en .usecase
import { LoginUsuarioUseCase } from '../../Aplicacion/use-cases/usuario/login-usuario.use-case'; // Importa este también

export class UsuarioController {
  // 2. INYECCIÓN DE DEPENDENCIAS
  // Aquí es donde "recibes" las herramientas que vas a usar
  constructor(
    private readonly usuarioService: UsuarioService, // Para crear, borrar, etc. (Legacy)
    private readonly loginUseCase: LoginUsuarioUseCase, // Para el login nuevo
    private readonly listarClientesUseCase: ListarClientesUseCase, // Para que el entrenador vea alumnos
  ) {}

  // --- MÉTODO REFACTORIZADO (LOGIN) ---
  login = async (req: Request, res: Response) => {
    try {
      const { nickname, contrasena } = req.body;

      if (!nickname || !contrasena) {
        return res.status(400).json({ error: 'faltan datos de acceso' });
      }

      // CAMBIO: Usamos el Caso de Uso en vez del Servicio
      // Esto delega la lógica de verificar contraseña al caso de uso
      const usuario = await this.loginUseCase.execute(nickname, contrasena);

      res.status(200).json(usuario);
    } catch (error: any) {
      // Manejo de errores simplificado
      console.error(error);
      const status = error.message === 'Usuario no encontrado' ? 404 : 401;
      res.status(status).json({ error: error.message });
    }
  };

  // --- NUEVO MÉTODO (LISTAR CLIENTES) ---
  getClientes = async (req: Request, res: Response) => {
    try {
      // Este método es el que llamará el Entrenador
      const clientes = await this.listarClientesUseCase.execute();
      res.status(200).json(clientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener clientes' });
    }
  };

  // --- MÉTODOS EXISTENTES (Siguen usando usuarioService por ahora) ---

  createUsuario = async (req: Request, res: Response) => {
    try {
      const datos = UsuarioSchema.parse(req.body);
      const nuevo = await this.usuarioService.registrarUsuario(datos as any);
      res.status(201).json(nuevo);
    } catch (error: any) {
      console.error(error);
      if (error instanceof ZodError) return res.status(400).json({ error: error.issues });
      if (error.message && error.message.includes('existe'))
        return res.status(409).json({ error: error.message });
      res.status(500).json({ error: 'error interno al crear usuario' });
    }
  };

  getUsuarios = async (req: Request, res: Response) => {
    try {
      const usuarios = await this.usuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al obtener el listado de usuarios' });
    }
  };

  getUsuarioByNickname = async (req: Request, res: Response) => {
    try {
      const { nickname } = req.params;
      const usuario = await this.usuarioService.obtenerPorNickname(nickname);
      if (!usuario) return res.status(404).json({ error: 'usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al buscar usuario' });
    }
  };

  updateUsuario = async (req: Request, res: Response) => {
    try {
      const datos = UsuarioSchema.partial().parse(req.body);
      const actualizado = await this.usuarioService.actualizarUsuario(
        req.params.nickname,
        datos as any,
      );
      if (!actualizado)
        return res.status(404).json({ error: 'usuario no encontrado para actualizar' });
      res.json(actualizado);
    } catch (error: any) {
      console.error(error);
      if (error instanceof ZodError) return res.status(400).json({ error: error.issues });
      res.status(500).json({ error: 'error al actualizar usuario' });
    }
  };

  deleteUsuario = async (req: Request, res: Response) => {
    try {
      const eliminado = await this.usuarioService.eliminarUsuario(req.params.nickname);
      if (!eliminado) return res.status(404).json({ error: 'usuario no encontrado para eliminar' });
      res.json({ message: 'usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error al eliminar usuario' });
    }
  };
}
