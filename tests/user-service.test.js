const { test, describe, beforeEach } = require('node:test');
const assert = require('assert/strict');

const { UserService } = require('../dist/application/services/usuario.service');

// Doble de prueba: repositorio en memoria que simula la DB.
class InMemoryUserRepo {
  constructor() {
    this.data = [];
    this.nextId = 1;
  }

  async getAll() {
    return this.data;
  }

  async create(user) {
    const created = { id: this.nextId++, ...user };
    this.data.push(created);
    return created;
  }
}

describe('UserService con repositorio en memoria', () => {
  let repo;
  let service;

  beforeEach(() => {
    // Arrange: repositorio nuevo para que ningún test dependa del anterior.
    repo = new InMemoryUserRepo();
    service = new UserService(repo);
  });

  test('crea usuarios y normaliza email', async () => {
    // Act: creamos con email en mayúsculas/espacios
    const user = await service.createUser({ nombre: 'Ana', email: 'ANA@MAIL.com' });
    // Assert: el servicio aplica el Value Object y normaliza a minúsculas
    assert.equal(user.id, 1);
    assert.equal(user.email, 'ana@mail.com');
    const users = await service.getAllUsers();
    assert.equal(users.length, 1);
  });

  test('lanza error con email inválido', async () => {
    // El VO debe rechazar formatos incorrectos y propagar el error
    await assert.rejects(() => service.createUser({ nombre: 'Ana', email: 'x' }), /Email inválido/);
  });
});
