import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getPhysicalDocuments, getChiefMembers } from './consuladoService.js';

describe('consuladoService', () => {
  describe('getPhysicalDocuments', () => {
    it('should return an array with at least one document object', () => {
      const docs = getPhysicalDocuments();
      assert(Array.isArray(docs));
      assert(docs.length >= 1);
      const doc = docs[0];
      assert(doc.id);
      assert(doc.titulo);
      assert(doc.ano);
      assert(doc.descricao);
      assert(doc.fonte);
    });
  });

  describe('getChiefMembers', () => {
    it('should return an array of members containing known roles', () => {
      const members = getChiefMembers();
      assert(Array.isArray(members));
      assert(members.length >= 1);
      const roles = members.map(m => m.cargo);
      assert(roles.includes('Cônsul-Geral'));
      assert(roles.includes('Chefe da Seção Consular'));
      const kevin = members.find(m => m.nome.startsWith('Kevin'));
      assert(kevin, 'Expected a member named Kevin');
    });
  });
});