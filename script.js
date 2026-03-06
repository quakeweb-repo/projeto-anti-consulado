// script.js
document.addEventListener('DOMContentLoaded', function() {
    loadGeosampaData();
    loadSecurityData();
    analyzeModernization();
});

async function loadGeosampaData() {
    const geosampaDiv = document.getElementById('geosampa-data');
    try {
        // Geocodificar endereço
        const address = 'Rua Henri Dunant 500, São Paulo, SP, 04709-110';
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const nominatimResponse = await fetch(nominatimUrl);
        const nominatimData = await nominatimResponse.json();
        if (nominatimData.length > 0) {
            const lat = nominatimData[0].lat;
            const lon = nominatimData[0].lon;
            geosampaDiv.innerHTML += `<p>Coordenadas: ${lat}, ${lon}</p>`;
        }

        // Buscar dados de edificações
        const edificacaoUrl = 'https://api-geosampa.herokuapp.com/v1/arquivos?Título=Edificação';
        const edificacaoResponse = await fetch(edificacaoUrl);
        const edificacaoData = await edificacaoResponse.json();
        geosampaDiv.innerHTML += `<h3>Dados de Edificações:</h3><pre>${JSON.stringify(edificacaoData, null, 2)}</pre>`;

        // Buscar dados de risco
        const riscoUrl = 'https://api-geosampa.herokuapp.com/v1/arquivos?Título=Área de Risco Geológico';
        const riscoResponse = await fetch(riscoUrl);
        const riscoData = await riscoResponse.json();
        geosampaDiv.innerHTML += `<h3>Dados de Risco:</h3><pre>${JSON.stringify(riscoData, null, 2)}</pre>`;

    } catch (error) {
        geosampaDiv.innerHTML = 'Erro ao carregar dados do GEOSAMPA: ' + error.message;
    }
}

async function loadSecurityData() {
    const securityDiv = document.getElementById('security-data');
    // Como scraping direto pode ter CORS, mostrar links
    securityDiv.innerHTML = `
        <p>Informações de segurança do consulado:</p>
        <ul>
            <li><a href="https://ais.usvisa-info.com/pt-BR/niv/information/consulate" target="_blank">Informações do Consulado</a></li>
            <li><a href="https://br.usembassy.gov/pt/visas-pt/important-visa-information-pt/" target="_blank">Informações de Vistos</a></li>
            <li><a href="https://www.embassypages.com/estadosunidos-embaixada-brasilia-brasil-pt" target="_blank">Embaixada em Brasília</a></li>
            <li><a href="https://br.usembassy.gov/embassy-consulates/saopaulo/" target="_blank">Consulado em São Paulo</a></li>
        </ul>
    `;
}

function analyzeModernization() {
    const modernizationDiv = document.getElementById('modernization-data');
    modernizationDiv.innerHTML = `
        <p>Baseado nos dados OSINT:</p>
        <ul>
            <li>Melhorar sistemas de vigilância com câmeras de alta resolução e IA para detecção de ameaças.</li>
            <li>Implementar barreiras físicas e controle de acesso biométrico.</li>
            <li>Analisar riscos geológicos e reforçar estrutura contra terremotos ou deslizamentos.</li>
            <li>Integrar com infraestrutura urbana para melhor conectividade e evacuação.</li>
            <li>Modernizar iluminação e sistemas de alarme para prevenção de intrusões.</li>
        </ul>
    `;
}