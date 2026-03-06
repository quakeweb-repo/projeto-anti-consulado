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

app.get('/api/info', (req, res) => {
    res.json({
        sistema: "Background Check Pro - Sistema Profissional de Verificação",
        versao: "2.0.0",
        foco: "Verificação profunda de pessoas e empresas",
        operador: "Background Check Pro Team",
        status: "Operacional"
    });
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

// CPF Generator Service
import {
    generateCPFFromName,
    generateCPFOptions,
    validateCPF,
    formatCPF,
    generateCPFWithState,
    batchGenerateCPF,
    analyzeCPF,
    isBlacklistedCPF
} from './src/services/cpfGeneratorService.js';

// Enhanced Instagram Service
import {
    getInstagramProfileData,
    batchInstagramAnalysis,
    validateInstagramUsername
} from './src/services/instagramService.js';

// endpoints simples que simulam consultas a serviços externos
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
// CPF GENERATOR ENDPOINTS
// ============================================================================

app.get('/api/cpf/generate/:name', (req, res) => {
    const { name } = req.params;
    const { state, options = '1' } = req.query;
    
    try {
        if (options > '1') {
            // Generate multiple options
            const count = parseInt(options);
            const cpfOptions = generateCPFOptions(name, count);
            res.json({ name, state, options: cpfOptions });
        } else {
            // Generate single CPF
            const cpfResult = state 
                ? generateCPFWithState(name, state)
                : generateCPFFromName(name);
            res.json({ name, state, result: cpfResult });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cpf/batch', (req, res) => {
    const { names } = req.body;
    
    if (!Array.isArray(names)) {
        return res.status(400).json({ error: 'names must be an array' });
    }
    
    try {
        const results = batchGenerateCPF(names);
        res.json({ count: names.length, results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/cpf/validate/:cpf', (req, res) => {
    const { cpf } = req.params;
    
    try {
        const analysis = analyzeCPF(cpf);
        res.json(analysis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/cpf/format/:cpf', (req, res) => {
    const { cpf } = req.params;
    
    try {
        const formatted = formatCPF(cpf);
        const isValid = validateCPF(cpf);
        res.json({ 
            original: cpf, 
            formatted: formatted, 
            isValid: isValid 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// INSTAGRAM ENHANCED ENDPOINTS - Superior to BuscaPrime
// ============================================================================

app.get('/api/instagram/profile/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const profileData = await getInstagramProfileData(username);
        res.json({ username, data: profileData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/instagram/batch', async (req, res) => {
    const { usernames } = req.body;
    
    if (!Array.isArray(usernames)) {
        return res.status(400).json({ error: 'usernames must be an array' });
    }
    
    try {
        const results = await batchInstagramAnalysis(usernames);
        res.json({ count: usernames.length, results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/instagram/validate/:input', (req, res) => {
    const { input } = req.params;
    
    try {
        const validation = validateInstagramUsername(input);
        res.json(validation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================================
// LIVE MINING ENDPOINTS - Real-time Processing
// ============================================================================

// Mining status endpoint for live updates
app.get('/api/mining/status/:requestId', (req, res) => {
    const { requestId } = req.params;
    
    // In a real implementation, this would check actual request status
    // For now, simulate progress
    const mockStatus = {
        requestId,
        status: 'running',
        step: Math.floor(Math.random() * 10),
        totalSteps: 10,
        progress: Math.floor(Math.random() * 100),
        partialResults: {
            instagram: {
                id: 'instagram',
                type: 'instagram',
                title: 'Instagram Analysis',
                status: 'processing',
                data: {
                    followers: Math.floor(Math.random() * 10000),
                    following: Math.floor(Math.random() * 1000),
                    posts: Math.floor(Math.random() * 500)
                }
            }
        },
        timestamp: new Date().toISOString()
    };
    
    res.json(mockStatus);
});

// Export endpoints
app.get('/api/export/json/:requestId', (req, res) => {
    const { requestId } = req.params;
    
    // Generate mock JSON export
    const exportData = {
        requestId,
        exportType: 'json',
        timestamp: new Date().toISOString(),
        data: {
            query: 'Sample Query',
            results: 'Mock Results',
            analysis: 'Mock Analysis'
        }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="background-check-${requestId}.json"`);
    res.send(JSON.stringify(exportData, null, 2));
});

app.get('/api/export/pdf/:requestId', (req, res) => {
    const { requestId } = req.params;
    
    // For PDF export, would use a library like puppeteer
    // For now, return a simple text file
    const pdfContent = `
BACKGROUND CHECK REPORT - ${requestId}
Generated: ${new Date().toISOString()}
==========================================
Query: Sample Query
Results: Mock Results
Analysis: Mock Analysis
==========================================
This is a mock PDF export.
In production, this would be a properly formatted PDF.
    `;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="background-check-${requestId}.txt"`);
    res.send(pdfContent);
});

app.get('/api/share/:requestId', (req, res) => {
    const { requestId } = req.params;
    
    // Generate shareable link
    const shareUrl = `${req.protocol}://${req.get('host')}/shared/${requestId}`;
    
    res.json({
        requestId,
        shareUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        timestamp: new Date().toISOString()
    });
});

// Shared results endpoint
app.get('/shared/:requestId', (req, res) => {
    const { requestId } = req.params;
    
    // Serve shared results page
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// WEBSOCKET SUPPORT FOR REAL-TIME UPDATES
// ============================================================================

const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

app.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws/mining') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
});

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial status
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to live mining updates'
    }));
    
    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('Invalid WebSocket message:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'subscribe':
            // Subscribe to specific request updates
            ws.requestId = data.requestId;
            break;
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
    }
}

// Broadcast updates to all connected clients
function broadcastUpdate(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  BACKGROUND CHECK PRO - Sistema Profissional de Verificação     ║
║  Servidor iniciado com sucesso                                ║
╠════════════════════════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}                                 ║
║  Foco: Verificação profunda de pessoas e empresas              ║
║  Recursos: Instagram, CPF, CNPJ, OSINT avançado               ║
║  Interface: Terminal-style neobrutalista                       ║
║  Live Mining: AJAX + WebSocket em tempo real                   ║
╚════════════════════════════════════════════════════════════════╝
    `);
});
