import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

describe('API Ejercicios', () => {
  // Antes de nada, nos aseguramos de que Mongo esté cerrado o mockeado si usas memoria
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Debería crear un ejercicio correctamente', async () => {
    const res = await request(app).post('/api/ejercicios').send({
      nombre: 'Press Banca',
    });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Press Banca');
    expect(res.body).toHaveProperty('id'); // O _id si no lo has mapeado
  });

  it('Debería fallar si el nombre está vacío (Validación Zod)', async () => {
    const res = await request(app).post('/api/ejercicios').send({
      nombre: '',
    });

    expect(res.status).toBe(400); // Bad Request
  });

  it('Debería listar los ejercicios', async () => {
    const res = await request(app).get('/api/ejercicios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
