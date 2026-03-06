import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getOsintCategory } from './osintBrazucaService.js';

describe('osintBrazucaService', () => {
  const cats = ['infraestrutura','redes','web','documentos','fiscal','seguranca'];
  cats.forEach(cat => {
    it(`should return object for category ${cat}`, async () => {
      const data = await getOsintCategory(cat);
      assert(typeof data === 'object');
    });
  });

  it('unknown category yields error field', async () => {
    const data = await getOsintCategory('xyz');
    assert(data.error);
  });
});