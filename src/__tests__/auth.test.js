const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../index');
const User = require('../models/User');

describe('Auth routes', () => {
  it('POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 't@test.com', password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.msg).toMatch(/creado/i);

    const u = await User.findOne({ email: 't@test.com' });
    expect(u).not.toBeNull();
    expect(u.name).toBe('Test');
  });

  it('POST /api/auth/login', async () => {
    const plain = 'secreto123';
    const hash = await bcrypt.hash(plain, 10);
    await User.create({ name: 'X', email: 'x@x.com', password: hash });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@x.com', password: plain });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body.msg).toMatch(/exitoso/i);
  });
});