/**
 * Testes unitários para cnpjPublicoService
 * Node 20+ — node --test src/services/cnpjPublicoService.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { searchCnpj, CnpjValidationError } from './cnpjPublicoService.js';

describe('cnpjPublicoService', () => {
  describe('searchCnpj', () => {
    it('deve rejeitar CNPJ inválido', async () => {
      try {
        await searchCnpj({ cnpj: '123' });
        assert.fail('Deveria ter lançado erro');
      } catch (error) {
        assert(error instanceof CnpjValidationError);
      }
    });

    it('deve aceitar CNPJ formatado', async () => {
      const result = await searchCnpj({
        cnpj: '02.916.265/0001-60',
        requestId: 'req-001',
      });

      assert(result);
      assert(result.cnpj);
      assert(result._evidenceManifest);
    });

    it('deve retornar estrutura compatível com fetchCNPJ', async () => {
      const result = await searchCnpj({
        cnpj: '02916265000160',
        requestId: 'req-001',
      });

      // Verificar campos esperados
      assert(result.cnpj);
      assert(result.nome);
      assert(result.situacao);
      assert(result.socios_raw);
      assert(Array.isArray(result.socios_raw));
      assert(result._source);
      assert(result._evidenceManifest);
    });

    it('deve aplicar redaction por padrão (máscara CPF/CNPJ)', async () => {
      const result = await searchCnpj({
        cnpj: '02916265000160',
        requestId: 'req-001',
      });

      // Verificar que CPF está mascarado
      if (result.socios_raw && result.socios_raw[0]) {
        const socio = result.socios_raw[0];
        assert(socio.cpf_cnpj.includes('*'), 'CPF deveria estar mascarado');
      }
    });

    it('deve criar evidence manifest com assinatura', async () => {
      const result = await searchCnpj({
        cnpj: '02916265000160',
        requestId: 'req-001',
      });

      const manifest = result._evidenceManifest;
      assert(manifest.payloadHash);
      assert(manifest.collectedAt);
      assert(manifest.sourceUrl);
      assert(manifest.signature);
      assert(manifest.cnpj === '02916265000160');
    });

    it('deve rejeitar unmasking incompleto', async () => {
      try {
        await searchCnpj({
          cnpj: '02916265000160',
          idDelegado: 'DELEG-001',
          // Falta approvalId, legalBasis, purpose
        });
        assert.fail('Deveria ter lançado erro');
      } catch (error) {
        assert(error instanceof CnpjValidationError);
        assert(error.code === 'INCOMPLETE_UNMASKING_PARAMS');
      }
    });

    it('deve aceitar parâmetros de unmasking completos', async () => {
      const result = await searchCnpj({
        cnpj: '02916265000160',
        idDelegado: 'DELEG-001',
        approvalId: 'hash-aprovacao-123',
        legalBasis: 'LGPD Art. 23, inciso II',
        purpose: 'Investigação criminal',
        requestId: 'req-002',
      });

      assert(result);
      assert(result._evidenceManifest);
      assert(result._evidenceManifest.approvalId === 'hash-aprovacao-123');
    });
  });
});
