import { generateSlug } from '../../src/utils/slug.js';

describe('Gerador de Slug', () => {
  test('deve gerar slug com 6 caracteres por padrão', () => {
    const slug = generateSlug();
    expect(slug).toHaveLength(6);
  });

  test('deve gerar slug com tamanho personalizado', () => {
    const slug = generateSlug(10);
    expect(slug).toHaveLength(10);
  });

  test('deve gerar apenas letras e números', () => {
    const slug = generateSlug();
    expect(slug).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('deve gerar slugs diferentes a cada chamada', () => {
    const slug1 = generateSlug();
    const slug2 = generateSlug();
    expect(slug1).not.toBe(slug2);
  });
});