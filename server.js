const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para mineração de dados GEOSAMPA
app.get('/api/geosampa/:query', async (req, res) => {
    const query = req.params.query;
    try {
        const url = `https://api-geosampa.herokuapp.com/v1/arquivos?${query}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para geocodificação
app.get('/api/geocode/:address', async (req, res) => {
    const address = req.params.address;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para scraping de sites relacionados (OSINT legal)
app.get('/api/scrape/:site', async (req, res) => {
    const site = req.params.site;
    const allowedSites = {
        'consulate': 'https://ais.usvisa-info.com/pt-BR/niv/information/consulate',
        'visas': 'https://br.usembassy.gov/pt/visas-pt/important-visa-information-pt/',
        'embassy-brasilia': 'https://www.embassypages.com/estadosunidos-embaixada-brasilia-brasil-pt',
        'consulate-sp': 'https://br.usembassy.gov/embassy-consulates/saopaulo/'
    };

    if (!allowedSites[site]) {
        return res.status(400).json({ error: 'Site não permitido' });
    }

    try {
        const response = await axios.get(allowedSites[site]);
        const $ = cheerio.load(response.data);
        const text = $('body').text().substring(0, 5000); // Limitar texto
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para buscar processos SEI relacionados (simulado, pois API limitada)
app.get('/api/sei/search/:term', async (req, res) => {
    const term = req.params.term;
    try {
        // Como a API GEOSAMPA tem /sei, mas é limitada, buscar todos e filtrar
        const url = 'https://api-geosampa.herokuapp.com/v1/sei';
        const response = await axios.get(url);
        const data = response.data;
        // Filtrar por termo (simples, pois dados são mock)
        const filtered = data.filter(item => 
            JSON.stringify(item).toLowerCase().includes(term.toLowerCase())
        );
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para análise de irregularidades (baseado em dados OSINT)
app.get('/api/analyze/:address', async (req, res) => {
    const address = req.params.address;
    try {
        // Geocodificar
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        const coords = geocodeResponse.data[0];

        // Buscar riscos
        const riskUrl = 'https://api-geosampa.herokuapp.com/v1/arquivos?Título=Área de Risco Geológico';
        const riskResponse = await axios.get(riskUrl);

        // Buscar edificações
        const buildUrl = 'https://api-geosampa.herokuapp.com/v1/arquivos?Título=Edificação';
        const buildResponse = await axios.get(buildUrl);

        // Análise simples
        const analysis = {
            coordenadas: coords ? { lat: coords.lat, lon: coords.lon } : null,
            riscos: riskResponse.data,
            edificacoes: buildResponse.data,
            irregularidades_potenciais: [
                'Verificar licenças de construção',
                'Analisar processos no SEI relacionados ao endereço',
                'Checar conformidade com zoneamento urbano',
                'Avaliar riscos geológicos na área'
            ],
            oportunidades_modernizacao: [
                'Instalação de sistemas de monitoramento avançado',
                'Reforço estrutural contra riscos identificados',
                'Integração com infraestrutura de emergência',
                'Modernização de acessos e barreiras de segurança'
            ]
        };

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Webservice rodando em http://localhost:${PORT}`);
});