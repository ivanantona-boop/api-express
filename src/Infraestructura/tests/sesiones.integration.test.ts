import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

describe('API Sesiones', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  const mockPlanId = new mongoose.Types.ObjectId().toString();
  const mockUsuarioId = new mongoose.Types.ObjectId().toString();
  const mockEjercicioId = new mongoose.Types.ObjectId().toString();

  it('Debería crear una sesión con ejercicios (DetalleSesion)', async () => {
    const res = await request(app)
      .post('/api/sesiones')
      .send({
        id_plan: mockPlanId,
        id_usuario: mockUsuarioId,
        fecha: '2024-02-20',
        ejercicios: [
          {
            id_ejercicio: mockEjercicioId,
            series: 4,
            repeticiones: 10,
            peso: 80,
            observaciones: 'RPE 8',
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.ejercicios).toHaveLength(1);
    expect(res.body.ejercicios[0].peso).toBe(80);
  });

  it('Debería fallar si las series son negativas (Validación Zod)', async () => {
    const res = await request(app)
      .post('/api/sesiones')
      .send({
        id_plan: mockPlanId,
        id_usuario: mockUsuarioId,
        ejercicios: [
          {
            id_ejercicio: mockEjercicioId,
            series: -5, // ❌ ERROR
            repeticiones: 10,
            peso: 50,
          },
        ],
      });

    expect(res.status).toBe(400);
  });
});
