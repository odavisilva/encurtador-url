import type { Request, Response, NextFunction } from 'express';
import { UrlService } from '../services/urlService.js';
import { isValidUrl } from '../utils/validateUrl.js';

const urlService = new UrlService();

export async function createShortUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { longUrl, slug } = req.body;
    if (!longUrl || !isValidUrl(longUrl)) return res.status(400).json({ error: 'URL inválida' });

    const url = await urlService.create(longUrl, slug);
    const shortUrl = `${req.protocol}://${req.get('host')}/${url.slug}`;
    return res.status(201).json({ shortUrl, slug: url.slug, longUrl: url.longUrl });
  } catch (err: any) {
    if (err?.message && err.message.includes('Slug')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

export async function redirect(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    if (!slug || slug.length < 1) return res.status(400).json({ error: 'Slug inválido' });

    const url = await urlService.findBySlug(slug);
    if (!url) return res.status(404).json({ error: 'Link não encontrado' });

    await urlService.incrementClicks(slug);

    return res.redirect(url.longUrl);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    
    if (!slug || slug.length < 1) {
      return res.status(400).json({ error: 'Slug inválido' });
    }
    
    const stats = await urlService.getStats(slug);
    if (!stats) return res.status(404).json({ error: 'Não encontrado' });
    return res.json(stats);
  } catch (err: unknown) {
    next(err);
  }
}
