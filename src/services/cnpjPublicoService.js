/**
 * Serviço de busca de CNPJ com validação, redaction e conformidade LGPD
 * Node 20+ — Firebase Firestore / API Publica CNPJ
 */

import { z } from 'zod';
import { createHash } from 'crypto';

// ============================================================================
// SCHEMAS ZÓDY
// ============================================================================

const SearchCnpjInputSchema = z.object({
  cnpj: z.string()
    .min(1)
    .transform(c => c.replace(/[^\d]/g, ''))
    .refine(c => c.length === 14, { message: 'CNPJ deve ter 14 dígitos' }),
  idDelegado: z.string().optional(),
  requestId: z.string().optional(),
  purpose: z.string().optional(),
  approvalId: z.string().optional(),
  legalBasis: z.string().optional(),
  apiKey: z.string().optional(),
});

const UnmaskingRequiredSchema = z.object({
  idDelegado: z.string(),
  approvalId: z.string(),
  legalBasis: z.string(),
  purpose: z.string(),
});

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

export class CnpjValidationError extends Error {
  constructor(message, code = 'VALIDATION_ERROR', details = {}) {
    super(message);
    this.name = 'CnpjValidationError';
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

class CircuitBreaker {
  constructor(threshold = 5, timeout = 30000) {
    this.failureCount = 0;
    this.successCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  async callAsync(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.successCount = 0;
    }
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// ============================================================================
// AUDIT LOG
// ============================================================================

const auditLog = (action, cnpj, data, options = {}) => {
  const { requestId, idDelegado, purpose, hide_sensitive = true } = options;
  const timestamp = new Date().toISOString();
  const masked_cnpj = hide_sensitive ? cnpj.replace(/\d(?=\d{2})/g, '*') : cnpj;

  const logEntry = {
    timestamp,
    action,
    cnpj: masked_cnpj,
    requestId: requestId || 'no-request-id',
    idDelegado: idDelegado || null,
    purpose: purpose || null,
    status: data?.status || 'unknown',
  };

  // Em produção, enviar para sistema de log centralizado
  console.log('[AUDIT]', JSON.stringify(logEntry));
};

// ============================================================================
// REDACTION & MASKING
// ============================================================================

const maskCpfCnpj = (value) => {
  if (!value) return value;
  const str = String(value);
  if (str.length === 11) { // CPF
    return str.replace(/\d(?=\d{2})/g, '*');
  }
  if (str.length === 14) { // CNPJ
    return str.replace(/\d(?=\d{2})/g, '*');
  }
  return value;
};

const maskEmail = (email) => {
  if (!email) return email;
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.substring(0, 2) + '*'.repeat(Math.max(1, local.length - 2)) + '@' + domain;
  return masked;
};

const redactRecord = (record, shouldRedact = true) => {
  if (!shouldRedact) return record;

  const redacted = { ...record };

  // Redact socios info
  if (redacted.socios_raw && Array.isArray(redacted.socios_raw)) {
    redacted.socios_raw = redacted.socios_raw.map(s => ({
      ...s,
      cpf_cnpj: maskCpfCnpj(s.cpf_cnpj),
      email: maskEmail(s.email),
      cpfHash: createHash('sha256').update(s.cpf_cnpj || '').digest('hex'),
    }));
  }

  return redacted;
};

// ============================================================================
// HSM/KMS HOOKS
// ============================================================================

let signManifestHook = null;

export const setSignManifestHook = (hook) => {
  signManifestHook = hook;
};

const signManifest = async (manifest) => {
  if (signManifestHook) {
    return await signManifestHook(manifest);
  }
  // Default: sign with SHA256 hash
  return createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
};

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 500) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

// ============================================================================
// MOCK DATA GENERATOR (para testes/demo)
// ============================================================================

const generateMockCnpjData = (cnpj) => {
  return {
    cnpj,
    nome: 'Empresa Exemplo LTDA',
    situacao: 'Ativa',
    tipo: 'Empresa Privada',
    data_abertura: '2010-05-15',
    data_situacao: '2024-01-10',
    socios_raw: [
      {
        cpf_cnpj: '12345678901',
        nome: 'João Silva',
        email: 'joao@example.com',
        qualificacao: 'Sócio-administrador',
      },
      {
        cpf_cnpj: '98765432100',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        qualificacao: 'Sócio',
      },
    ],
    capital_social: '1000000.00',
    natureza_juridica: '2062',
    ramo_atividade: '6511500',
    _source: 'cnpj_publico_api',
  };
};

// ============================================================================
// MAIN SERVICE
// ============================================================================

class CnpjPublicoService {
  constructor() {
    this.circuitBreaker = new CircuitBreaker(5, 30000);
  }

  async searchCnpj(input) {
    // Validação
    let validated;
    try {
      validated = SearchCnpjInputSchema.parse(input);
    } catch (schemaError) {
      throw new CnpjValidationError(
        `Validação de entrada falhou: ${schemaError.message}`,
        'SCHEMA_VALIDATION',
        { errors: schemaError.errors }
      );
    }

    const {
      cnpj,
      idDelegado,
      requestId,
      purpose,
      approvalId,
      legalBasis,
      apiKey,
    } = validated;

    // Verificar se é unmasking
    const shouldUnmask = !!(idDelegado && approvalId && legalBasis && purpose);
    if (idDelegado && !shouldUnmask) {
      throw new CnpjValidationError(
        'Para desmascarar dados, são necessários: idDelegado, approvalId, legalBasis e purpose',
        'INCOMPLETE_UNMASKING_PARAMS'
      );
    }

    // Audit log
    auditLog('searchCnpj', cnpj, { status: 'started' }, {
      requestId,
      idDelegado,
      purpose,
      hide_sensitive: true,
    });

    try {
      // Usar circuit breaker
      const data = await this.circuitBreaker.callAsync(async () => {
        return await retryWithBackoff(async () => {
          return await this._fetchCnpjData(cnpj, apiKey);
        });
      });

      // Redaction
      const redacted = redactRecord(data, !shouldUnmask);

      // Evidence manifest
      const manifest = {
        payloadHash: createHash('sha256').update(JSON.stringify(redacted)).digest('hex'),
        collectedAt: new Date().toISOString(),
        collectorId: idDelegado || 'system',
        sourceUrl: 'https://api.cnpj.publico.gov.br',
        approvalId: approvalId || null,
        cnpj,
        requestId: requestId || null,
      };

      manifest.signature = await signManifest(manifest);

      const result = {
        ...redacted,
        _evidenceManifest: manifest,
      };

      // Audit log success
      auditLog('searchCnpj', cnpj, { status: 'success' }, {
        requestId,
        idDelegado,
        purpose,
        hide_sensitive: true,
      });

      return result;
    } catch (error) {
      // Audit log error
      auditLog('searchCnpj', cnpj, { status: 'error', error: error.message }, {
        requestId,
        idDelegado,
        purpose,
        hide_sensitive: true,
      });

      if (error instanceof CnpjValidationError) {
        throw error;
      }

      throw new CnpjValidationError(
        `Erro ao buscar CNPJ: ${error.message}`,
        'FETCH_ERROR',
        { originalError: error.message }
      );
    }
  }

  async _fetchCnpjData(cnpj, apiKey) {
    // Timeout com AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      // Em produção, fazer requisição real
      // const response = await fetch(`https://api.cnpj.publico.gov.br/${cnpj}`, {
      //   headers: { 'Authorization': `Bearer ${apiKey}` },
      //   signal: controller.signal
      // });

      // Para testes, retornar mock
      const data = generateMockCnpjData(cnpj);
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

const service = new CnpjPublicoService();

export const searchCnpj = (input) => service.searchCnpj(input);
export const setSignManifestHookExport = setSignManifestHook;
