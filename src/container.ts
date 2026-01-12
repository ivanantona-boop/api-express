import db from './database';
import { UsuarioRepository } from './repository/usuario.repository';
import { UsuarioMockRepository } from './repository/usuario.mock.repository';   
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controllers/usuario.controller';

import { ProductoRepository } from './repository/producto.repository';
import { ProductoService } from './services/producto.service';
import { ProductoController } from './controllers/producto.controller';

import { EjercicioRepository } from './repository/ejercicio.repository';
import { EjercicioService } from './services/ejercicio.service';
import { EjercicioController } from './controllers/ejercicio.controller';

const isTest = process.env.NODE_ENV === 'test';

// 1. Repositorios (Inyectando 'db')
const usuarioRepo = isTest ? new UsuarioMockRepository() : new UsuarioRepository(db);
const productoRepo = new ProductoRepository(db);
const ejercicioRepo = new EjercicioRepository(db);

// 2. Servicios
const usuarioService = new UsuarioService(usuarioRepo);
const productoService = new ProductoService(productoRepo);
const ejercicioService = new EjercicioService(ejercicioRepo);

// 3. Controladores (Instancias)
const usuarioController = new UsuarioController(usuarioService);
const productoController = new ProductoController(productoService);
const ejercicioController = new EjercicioController(ejercicioService);

export { usuarioController, productoController, ejercicioController };