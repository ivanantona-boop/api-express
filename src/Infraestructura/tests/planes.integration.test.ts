import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

describe('API Planes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Simulamos un ID de usuario válido de Mongo
  const mockUsuarioId = new mongoose.Types.ObjectId().toString();

  it('Debería crear un plan asignado a un usuario', async () => {
    const res = await request(app).post('/api/planes').send({
      objetivo_principal: 'Ganar Fuerza',
      id_usuario: mockUsuarioId, // Enviamos el ID
      fecha_inicio: '2024-01-01',
    });

    expect(res.status).toBe(201);
    expect(res.body.objetivo_principal).toBe('Ganar Fuerza');
    expect(res.body.id_usuario).toBe(mockUsuarioId);
  });

  it('Debería fallar si falta el id_usuario', async () => {
    const res = await request(app).post('/api/planes').send({
      objetivo_principal: 'Perder Peso',
      // Falta id_usuario
    });

    expect(res.status).toBe(400);
  });
});
