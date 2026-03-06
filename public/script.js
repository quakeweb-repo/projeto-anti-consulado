// script.js
document.addEventListener('DOMContentLoaded', function() {
    loadAnalysis();
});

async function loadAnalysis() {
    const address = document.getElementById('address-input').value;
    try {
        const response = await fetch(`/api/analyze/${encodeURIComponent(address)}`);
        const data = await response.json();
        displayAnalysis(data);
    } catch (error) {
        console.error('Erro ao carregar análise:', error);
        showAlert('Erro ao carregar dados. Verifique a conexão.', 'danger');
    }
}

function displayAnalysis(data) {
    // Irregularidades
    const irregularitiesList = document.getElementById('irregularities-list');
    irregularitiesList.innerHTML = data.irregularidades_potenciais.map(item => 
        `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> ${item}</div>`
    ).join('');

    // Oportunidades
    const opportunitiesList = document.getElementById('opportunities-list');
    opportunitiesList.innerHTML = data.oportunidades_modernizacao.map(item => 
        `<div class="alert alert-success"><i class="fas fa-check-circle"></i> ${item}</div>`
    ).join('');

    // Dados Geo
    const geoData = document.getElementById('geo-data');
    geoData.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <h6>Coordenadas:</h6>
                <p>${data.coordenadas ? `${data.coordenadas.lat}, ${data.coordenadas.lon}` : 'Não encontrado'}</p>
            </div>
            <div class="col-md-4">
                <h6>Riscos Geológicos:</h6>
                <p>${data.riscos.length} registros encontrados</p>
                <button class="btn btn-sm btn-outline-primary" onclick="showDetails('riscos', ${JSON.stringify(data.riscos).replace(/"/g, '&quot;')})">Ver Detalhes</button>
            </div>
            <div class="col-md-4">
                <h6>Edificações:</h6>
                <p>${data.edificacoes.length} registros encontrados</p>
                <button class="btn btn-sm btn-outline-primary" onclick="showDetails('edificacoes', ${JSON.stringify(data.edificacoes).replace(/"/g, '&quot;')})">Ver Detalhes</button>
            </div>
        </div>
    `;
}

async function scrapeSite(site) {
    try {
        const response = await fetch(`/api/scrape/${site}`);
        const data = await response.json();
        document.getElementById('scraped-content').innerHTML = `<pre style="white-space: pre-wrap;">${data.text}</pre>`;
    } catch (error) {
        document.getElementById('scraped-content').innerHTML = '<p class="text-danger">Erro ao carregar conteúdo.</p>';
    }
}

async function searchSEI() {
    const term = document.getElementById('term-input').value;
    if (!term) {
        showAlert('Digite um termo para busca.', 'warning');
        return;
    }
    try {
        const response = await fetch(`/api/sei/search/${encodeURIComponent(term)}`);
        const data = await response.json();
        showAlert(`Encontrados ${data.length} processos relacionados ao termo "${term}".`, 'info');
        console.log('Processos SEI:', data);
        // Poderia abrir modal com detalhes
    } catch (error) {
        showAlert('Erro na busca SEI.', 'danger');
    }
}

function showDetails(type, data) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalhes - ${type}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <pre>${JSON.stringify(JSON.parse(data), null, 2)}</pre>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function exportReport() {
    const address = document.getElementById('address-input').value;
    const report = {
        endereco: address,
        data_analise: new Date().toISOString(),
        irregularidades: Array.from(document.querySelectorAll('#irregularities-list .alert')).map(el => el.textContent),
        oportunidades: Array.from(document.querySelectorAll('#opportunities-list .alert')).map(el => el.textContent),
        coordenadas: document.querySelector('#geo-data p')?.textContent || 'N/A'
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-osint-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('Relatório exportado com sucesso.', 'success');
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(alert);
    setTimeout(() => alert.remove(), 5000);
}