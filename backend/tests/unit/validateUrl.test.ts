import { isValidUrl } from '../../src/utils/validateUrl.js';

describe('Validação de URL', () => {
  test('deve aceitar URLs válidas com https', () => {
    expect(isValidUrl('https://google.com')).toBe(true);
    expect(isValidUrl('https://www.example.com')).toBe(true);
  });

  test('deve aceitar URLs válidas com http', () => {
    expect(isValidUrl('http://localhost:3000')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('deve rejeitar URLs inválidas', () => {
    expect(isValidUrl('não é url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });
});