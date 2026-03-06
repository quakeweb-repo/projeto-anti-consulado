// script.js
document.addEventListener('DOMContentLoaded', function() {
    loadAnalysis();
    setupSearch();
});

async function loadAnalysis() {
    const address = 'Rua Henri Dunant 500, São Paulo, SP, 04709-110';
    try {
        const response = await fetch(`/api/analyze/${encodeURIComponent(address)}`);
        const data = await response.json();
        displayAnalysis(data);
    } catch (error) {
        console.error('Erro ao carregar análise:', error);
    }
}

function displayAnalysis(data) {
    const geosampaDiv = document.getElementById('geosampa-data');
    const securityDiv = document.getElementById('security-data');
    const modernizationDiv = document.getElementById('modernization-data');

    geosampaDiv.innerHTML = `
        <h3>Coordenadas:</h3>
        <p>${data.coordenadas ? `${data.coordenadas.lat}, ${data.coordenadas.lon}` : 'Não encontrado'}</p>
        <h3>Riscos Geológicos:</h3>
        <pre>${JSON.stringify(data.riscos, null, 2)}</pre>
        <h3>Edificações:</h3>
        <pre>${JSON.stringify(data.edificacoes, null, 2)}</pre>
    `;

    securityDiv.innerHTML = `
        <h3>Irregularidades Potenciais:</h3>
        <ul>${data.irregularidades_potenciais.map(item => `<li>${item}</li>`).join('')}</ul>
        <h3>Links para Verificação:</h3>
        <ul>
            <li><a href="#" onclick="scrapeSite('consulate')">Informações do Consulado</a></li>
            <li><a href="#" onclick="scrapeSite('visas')">Informações de Vistos</a></li>
            <li><a href="#" onclick="scrapeSite('embassy-brasilia')">Embaixada em Brasília</a></li>
            <li><a href="#" onclick="scrapeSite('consulate-sp')">Consulado em São Paulo</a></li>
        </ul>
        <div id="scraped-content"></div>
    `;

    modernizationDiv.innerHTML = `
        <h3>Oportunidades de Modernização:</h3>
        <ul>${data.oportunidades_modernizacao.map(item => `<li>${item}</li>`).join('')}</ul>
    `;
}

async function scrapeSite(site) {
    try {
        const response = await fetch(`/api/scrape/${site}`);
        const data = await response.json();
        document.getElementById('scraped-content').innerHTML = `<pre>${data.text}</pre>`;
    } catch (error) {
        document.getElementById('scraped-content').innerHTML = 'Erro ao carregar conteúdo.';
    }
}

function setupSearch() {
    // Adicionar funcionalidade de busca on demand
    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Buscar Processo SEI';
    searchBtn.onclick = async () => {
        const term = prompt('Digite termo para busca (ex: consulado):');
        if (term) {
            try {
                const response = await fetch(`/api/sei/search/${encodeURIComponent(term)}`);
                const data = await response.json();
                alert(`Encontrados ${data.length} processos relacionados.`);
                console.log(data);
            } catch (error) {
                alert('Erro na busca.');
            }
        }
    };
    document.body.appendChild(searchBtn);
}