import request from 'supertest';
import app from '../../src/app.js';

describe('API E2E Tests', () => {
  test('POST /api/shorten - deve criar URL encurtada', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ longUrl: 'https://www.google.com' })
      .expect(201);

    expect(response.body).toHaveProperty('shortUrl');
    expect(response.body).toHaveProperty('slug');
    expect(response.body.longUrl).toBe('https://www.google.com');
  });

  test('POST /api/shorten - deve rejeitar URL inválida', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ longUrl: 'url-inválida' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/stats/:slug - deve retornar estatísticas', async () => {
    // Primeiro cria uma URL
    const createResponse = await request(app)
      .post('/api/shorten')
      .send({ longUrl: 'https://example.com' });

    const slug = createResponse.body.slug;

    // Depois busca estatísticas
    const statsResponse = await request(app)
      .get(`/api/stats/${slug}`)
      .expect(200);

    expect(statsResponse.body).toHaveProperty('clicks');
    expect(statsResponse.body.slug).toBe(slug);
  });

  test('GET /:slug - deve redirecionar para URL original', async () => {
    const createResponse = await request(app)
      .post('/api/shorten')
      .send({ longUrl: 'https://example.com' });

    const slug = createResponse.body.slug;

    await request(app)
      .get(`/${slug}`)
      .expect(302)
      .expect('Location', 'https://example.com');
  });
});