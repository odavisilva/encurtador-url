import { UrlService } from './urlService';
import { prisma } from '../prisma';

// Mock do Prisma
jest.mock('../prisma', () => ({
  prisma: {
    url: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));

describe('UrlService', () => {
  let urlService: UrlService;
  
  beforeEach(() => {
    urlService = new UrlService();
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('should create a URL with custom slug', async () => {
      // Mock implementation
      (prisma.url.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.url.create as jest.Mock).mockResolvedValue({
        id: '1',
        slug: 'custom',
        longUrl: 'https://example.com',
        clicks: 0,
        createdAt: new Date()
      });
      
      // Test
      const result = await urlService.create('https://example.com', 'custom');
      
      // Assertions
      expect(prisma.url.findUnique).toHaveBeenCalledWith({
        where: { slug: 'custom' }
      });
      expect(prisma.url.create).toHaveBeenCalledWith({
        data: { slug: 'custom', longUrl: 'https://example.com' }
      });
      expect(result.slug).toBe('custom');
    });
    
    // Adicione mais testes aqui
  });
});