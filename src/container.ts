import db from './database';
import { UsuarioRepository } from './Infraestructura/repository/usuario.repository';
import { UsuarioMockRepository } from './Infraestructura/repository/usuario.mock.repository';   
import { UsuarioService } from './Apliacacion/services/usuario.service';
import { UsuarioController } from './Infraestructura/controllers/usuario.controller';

import { ProductoRepository } from './Infraestructura/repository/producto.repository';
import { ProductoService } from './Apliacacion/services/producto.service';
import { ProductoController } from './Infraestructura/controllers/productos.controller';

import { EjercicioRepository } from './Infraestructura/repository/ejercicio.repository';
import { EjercicioService } from './Apliacacion/services/ejercicio.service';
import { EjercicioController } from './Infraestructura/controllers/ejercicio.controller';

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