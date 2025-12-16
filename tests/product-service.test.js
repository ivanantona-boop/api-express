const { test, describe, beforeEach } = require('node:test');
const assert = require('assert/strict');

// Importamos el servicio ya compilado (dist) para no depender de TS en los tests.
const { ProductService } = require('../dist/application/services/producto.service');

// Doble de prueba simple: un repo en memoria para no golpear la base real.
class InMemoryProductRepo {
  constructor() {
    this.data = [];
    this.nextId = 1;
  }

  async getAll() {
    return this.data;
  }

  async create(product) {
    const created = { id: this.nextId++, ...product };
    this.data.push(created);
    return created;
  }

  async update(id, product) {
    const idx = this.data.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data[idx] = { id, ...product };
    return true;
  }

  async delete(id) {
    const idx = this.data.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }
}

describe('ProductService con repositorio en memoria', () => {
  let repo;
  let service;

  beforeEach(() => {
    // Arrange: reiniciamos el estado antes de cada test para aislarlos.
    repo = new InMemoryProductRepo();
    service = new ProductService(repo);
  });

  test('crea y lista productos', async () => {
    // Act: creamos un producto
    const creado = await service.createProduct({ nombre: 'A', precio: 10 });
    // Assert: el ID autogenerado y los datos son correctos
    assert.equal(creado.id, 1);
    assert.equal(creado.nombre, 'A');

    // Act: listamos todos
    const productos = await service.getAllProducts();
    // Assert: quedó guardado y se puede leer
    assert.equal(productos.length, 1);
    assert.equal(productos[0].precio, 10);
  });

  test('actualiza producto existente', async () => {
    await service.createProduct({ nombre: 'A', precio: 10 });
    // Act: actualizamos el producto 1
    const actualizado = await service.updateProduct(1, { nombre: 'B', precio: 20 });
    // Assert: devuelve el nuevo estado
    assert.deepEqual(actualizado, { id: 1, nombre: 'B', precio: 20 });
  });

  test('lanza error si el id es inválido o no existe', async () => {
    // ID inválido (0) debe lanzar por el VO de Id
    await assert.rejects(() => service.updateProduct(0, { nombre: 'B', precio: 20 }), /Id inválido/);
    // ID válido pero no encontrado debe lanzar error de negocio
    await assert.rejects(() => service.updateProduct(99, { nombre: 'B', precio: 20 }), /no encontrado/);
  });

  test('borra producto y lanza error cuando no existe', async () => {
    await service.createProduct({ nombre: 'A', precio: 10 });
    // Act + Assert: eliminar existente devuelve true
    const eliminado = await service.deleteProduct(1);
    assert.equal(eliminado, true);

    // Act + Assert: validaciones de Id y no encontrado
    await assert.rejects(() => service.deleteProduct(0), /Id inválido/);
    await assert.rejects(() => service.deleteProduct(2), /no encontrado/);
  });
});
