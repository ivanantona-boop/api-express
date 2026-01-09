// src/container.ts
///-----USUARIOS-------
import { UsuarioRepository } from './repository/usuario.repository';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controllers/usuario.controller';

///-----PRODUCTOS-------
import { ProductoRepository } from './repository/producto.repository';
import { ProductoService } from './services/producto.service';
import { ProductoController } from './controllers/producto.controller';

///-----EJERCICIO-------
import { EjercicioRepository } from './repository/ejercicio.repository';
import { EjercicioService } from './services/ejercicio.service';
import { EjercicioController } from './controllers/ejercicio.controller';

// 1º Instanciamos el repo
const usuarioRepo = new UsuarioRepository();
const productoRepo = new ProductoRepository();
const ejercicioRepo = new EjercicioRepository();

// 2º Se lo pasamos al servicio
const usuarioService = new UsuarioService(usuarioRepo);
const productoService = new ProductoService(productoRepo);
const ejercicioService = new EjercicioService(ejercicioRepo);

// 3º Se lo pasamos al controlador
const usuarioController = new UsuarioController(usuarioService);
const productoController = new ProductoController(productoService);
const ejercicioController = new EjercicioController(ejercicioService);

// 4º Exportamos el controlador ya montado
export { usuarioController, productoController, ejercicioController };