import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

describe('API Planes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  const mockUsuarioId = new mongoose.Types.ObjectId().toString();

  it('Debería crear un plan asignado a un usuario', async () => {
    // 1. Enviamos CamelCase (Zod lo acepta)
    const res = await request(app).post('/api/planes').send({
      objetivoPrincipal: 'Ganar Fuerza',
      idUsuario: mockUsuarioId,
      fechaInicio: '2024-01-01',
    });

    expect(res.status).toBe(201);

    // 2. CORRECCIÓN: Esperamos SnakeCase (Mongo lo devuelve)
    expect(res.body.objetivo_principal).toBe('Ganar Fuerza'); // Antes: objetivoPrincipal
    expect(res.body.id_usuario).toBe(mockUsuarioId); // Antes: idUsuario
  });

  it('Debería fallar si falta el idUsuario', async () => {
    const res = await request(app).post('/api/planes').send({
      objetivoPrincipal: 'Perder Peso',
      // Falta idUsuario
    });

    expect(res.status).toBe(400);
  });
});
