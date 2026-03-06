import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// ROTAS
// ============================================================================

// Rota principal - servir index.html (GitHub Pages)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================================================
// INFORMAÇÕES DO SISTEMA
// ============================================================================

// adicionamos rota informativa básica
app.get('/api/info', (req, res) => {
    res.json({
        sistema: "Sistema OSINT - Análise Predial",
        versao: "1.0.0",
        consulado: "Consulado dos EUA em São Paulo",
        endereco: "Rua Henri Durant 500, São Paulo, SP, 04709-110",
        operador: "Prefeitura de São Paulo / Polícia Civil",
        status: "Operacional"
    });
});

// ============================================================================
// ROTAS DE DOMÍNIO - CONTEÚDOS RELACIONADOS AO CONSULADO
// ============================================================================

// infelizmente não há APIs públicas de documentos/séries, portanto
// retornamos dados simulados baseado em scraping
import { getPhysicalDocuments, getChiefMembers } from './src/services/consuladoService.js';

app.get('/api/consulate/documents', (req, res) => {
    const type = req.query.type;
    if (type === 'structure' || type === 'physical') {
        return res.json(getPhysicalDocuments());
    }
    res.status(400).json({ error: 'tipo inválido (use ?type=structure)' });
});

app.get('/api/consulate/members', (req, res) => {
    res.json(getChiefMembers());
});

// ============================================================================
// ROTAS DE MINERAÇÃO ON-DEMAND
// ============================================================================

import {
    getGeosampaData,
    getGeosampaDataLive,
    getPhotoCollection,
    getPhotoCollectionLive,
    getFireExitData,
    getSocialMediaData,
    getSocialMediaDataLive,
    getGoogleData,
    getGoogleDataLive,
    getOwaspCompliance
} from './src/services/miningService.js';

import { getOsintCategory } from './src/services/osintBrazucaService.js';

// Enhanced mining endpoints
import {
    getCombinedMiningData,
    getPessoaMiningData,
    getEmpresaMiningData,
    getWebScrapingData,
    getPhoneEnrichment,
    getEmailEnrichment
} from './src/services/enrichedMiningService.js';

// endpoints simples que simulam consultas a serviços externos (GEOSAMPA, banco de
// imagens, cadastro de saídas de incêndio etc). Em produção seriam proxies ou
// agregadores reais.

app.get('/api/mining/geosampa', async (req, res) => {
    if (req.query.live) {
        return res.json(await getGeosampaDataLive());
    }
    res.json(getGeosampaData());
});

app.get('/api/mining/photos', async (req, res) => {
    if (req.query.live) {
        return res.json(await getPhotoCollectionLive());
    }
    res.json(getPhotoCollection());
});

app.get('/api/mining/fireexits', (req, res) => {
    res.json(getFireExitData());
});

app.get('/api/mining/social', async (req, res) => {
    if (req.query.live) {
        return res.json(await getSocialMediaDataLive());
    }
    res.json(getSocialMediaData());
});

app.get('/api/mining/google', async (req, res) => {
    if (req.query.live) {
        return res.json(await getGoogleDataLive());
    }
    res.json(getGoogleData());
});

app.get('/api/mining/owasp', (req, res) => {
    res.json(getOwaspCompliance());
});

// ============================================================================
// ROTAS AGREGADAS OSINT BRAZUCA
// ============================================================================
app.get('/api/osint/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const data = await getOsintCategory(category);
        res.json({ category, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// ENHANCED MINING ENDPOINTS
// ============================================================================

app.get('/api/mining/enriched/:query', async (req, res) => {
    const { query } = req.params;
    const { type = 'pessoa' } = req.query;
    
    try {
        const data = await getCombinedMiningData(query, type);
        res.json({ query, type, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/mining/pessoa/:nome', async (req, res) => {
    const { nome } = req.params;
    const { cpf } = req.query;
    
    try {
        const data = await getPessoaMiningData(nome, cpf);
        res.json({ nome, cpf, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/mining/empresa/:razaoSocial', async (req, res) => {
    const { razaoSocial } = req.params;
    const { cnpj } = req.query;
    
    try {
        const data = await getEmpresaMiningData(razaoSocial, cnpj);
        res.json({ razaoSocial, cnpj, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/mining/scrape', async (req, res) => {
    const { url, selector = 'body' } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
        const data = await getWebScrapingData(url, selector);
        res.json({ url, selector, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/mining/phone/:phone', async (req, res) => {
    const { phone } = req.params;
    
    try {
        const data = await getPhoneEnrichment(phone);
        res.json({ phone, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/mining/email/:email', async (req, res) => {
    const { email } = req.params;
    
    try {
        const data = await getEmailEnrichment(email);
        res.json({ email, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Sistema OSINT - Análise Predial Consulado Americano          ║
║  Servidor iniciado com sucesso                                ║
╠════════════════════════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}                                 ║
║  Modo: Análise de Conformidade Predial                        ║
║  Operador: Prefeitura de São Paulo / Polícia Civil            ║
╚════════════════════════════════════════════════════════════════╝
    `);
});