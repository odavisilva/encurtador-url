import { UrlService } from '../../src/services/urlService.js';

// Mock do prisma para não acessar banco real
jest.mock('../../src/prisma.js', () => ({
  prisma: {
    url: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));

const mockPrisma = require('../../src/prisma.js').prisma;

describe('URL Service', () => {
  let urlService: UrlService;

  beforeEach(() => {
    urlService = new UrlService();
    jest.clearAllMocks();
  });

  test('deve criar URL com slug personalizado quando disponível', async () => {
    // Simula que slug não existe
    mockPrisma.url.findUnique.mockResolvedValue(null);
    mockPrisma.url.create.mockResolvedValue({
      id: '1',
      slug: 'meuslug',
      longUrl: 'https://example.com',
      clicks: 0
    });

    const result = await urlService.create('https://example.com', 'meuslug');

    expect(result.slug).toBe('meuslug');
    expect(mockPrisma.url.create).toHaveBeenCalledWith({
      data: { slug: 'meuslug', longUrl: 'https://example.com' }
    });
  });

  test('deve rejeitar slug já em uso', async () => {
    // Simula que slug já existe
    mockPrisma.url.findUnique.mockResolvedValue({ id: '1', slug: 'existente' });

    await expect(
      urlService.create('https://example.com', 'existente')
    ).rejects.toThrow('Slug já em uso');
  });

  test('deve buscar URL por slug', async () => {
    const mockUrl = { id: '1', slug: 'abc123', longUrl: 'https://example.com' };
    mockPrisma.url.findUnique.mockResolvedValue(mockUrl);

    const result = await urlService.findBySlug('abc123');

    expect(result).toEqual(mockUrl);
    expect(mockPrisma.url.findUnique).toHaveBeenCalledWith({
      where: { slug: 'abc123' }
    });
  });
});