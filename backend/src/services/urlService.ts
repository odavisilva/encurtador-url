import { prisma } from '../prisma.js';
import { generateSlug } from '../utils/slug.js';

/**
 * Serviço para gerenciamento de URLs encurtadas
 */
export class UrlService {
  /**
   * Cria uma nova URL encurtada
   * @param longUrl URL original a ser encurtada
   * @param customSlug Slug personalizado (opcional)
   * @returns Objeto contendo a URL encurtada
   * @throws {ConflictError} Se o slug personalizado já estiver em uso
   */
  async create(longUrl: string, customSlug?: string) {
    if (customSlug) {
      const exists = await prisma.url.findUnique({ where: { slug: customSlug } });
      if (exists) throw new Error('Slug já em uso');
      return prisma.url.create({ data: { slug: customSlug, longUrl } });
    }

    let slug = generateSlug();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await prisma.url.findUnique({ where: { slug } });
      if (!exists) {
        return prisma.url.create({ data: { slug, longUrl } });
      }
      slug = generateSlug();
      attempts++;
    }

    throw new Error('Não foi possível gerar um slug único, tente novamente');
  }

  /**
   * Busca uma URL pelo slug
   * @param slug Slug da URL encurtada
   * @returns Objeto da URL ou null se não encontrada
   */
  findBySlug(slug: string) {
    return prisma.url.findUnique({ where: { slug } });
  }

  /**
   * Incrementa o contador de cliques de uma URL
   * @param slug Slug da URL encurtada
   * @returns URL atualizada
   */
  incrementClicks(slug: string) {
    return prisma.url.update({ where: { slug }, data: { clicks: { increment: 1 } } });
  }

  /**
   * Obtém estatísticas de uma URL encurtada
   * @param slug Slug da URL encurtada
   * @returns Estatísticas da URL ou null se não encontrada
   */
  getStats(slug: string) {
    return prisma.url.findUnique({ 
      where: { slug }, 
      select: { id: true, slug: true, longUrl: true, clicks: true, createdAt: true } 
    });
  }
}
