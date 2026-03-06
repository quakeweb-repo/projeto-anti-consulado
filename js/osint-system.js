// ============================================
// BACKGROUND CHECK PRO - OSINT SYSTEM v3.0
// Clean, Powerful, No Errors
// ============================================

var BCP = (function() {
    'use strict';
    
    var currentSearchType = 'person';
    var isSearching = false;
    
    // Environment detection
    var isNetlify = window.location.hostname.includes('netlify.app');
    var isGitHubPages = window.location.hostname.includes('github.io');
    var isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    console.log('BCP OSINT System v3.0 loaded');
    console.log('Environment:', isNetlify ? 'Netlify' : (isGitHubPages ? 'GitHub Pages' : 'Localhost'));
    
    function getAPIBase() {
        if (isLocalhost) return '/.netlify/functions';
        if (isNetlify) return '/.netlify/functions';
        return 'https://glittering-sundae-4fba50.netlify.app/.netlify/functions';
    }
    
    function setSearchType(type) {
        currentSearchType = type;
        var btns = document.querySelectorAll('.type-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
        // Handle both button click and event.target
        var target = event && event.target ? event.target : btns[0];
        target.classList.add('active');
        
        var input = document.getElementById('searchInput');
        if (input) {
            var placeholders = {
                'person': 'Digite nome completo da pessoa...',
                'company': 'Digite razao social ou CNPJ...',
                'cpf': 'Digite CPF (apenas numeros)...',
                'phone': 'Digite telefone com DDD...',
                'email': 'Digite endereco de e-mail...',
                'instagram': 'Digite username do Instagram...'
            };
            input.placeholder = placeholders[type] || placeholders['person'];
        }
    }
    
    function performSearch(event) {
        if (event) event.preventDefault();
        
        if (isSearching) {
            console.log('Search already in progress');
            return false;
        }
        
        var input = document.getElementById('searchInput');
        if (!input) {
            console.error('Search input not found');
            return false;
        }
        
        var query = input.value.trim();
        if (!query) {
            alert('Por favor, digite um termo para pesquisa');
            return false;
        }
        
        isSearching = true;
        showLoading();
        
        // Simulate OSINT search with mock data
        setTimeout(function() {
            var results = generateOSINTResults(query, currentSearchType);
            displayResults(results);
            isSearching = false;
        }, 1500);
        
        return false;
    }
    
    function showLoading() {
        var grid = document.getElementById('resultsGrid');
        if (grid) {
            grid.innerHTML = '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-spinner fa-spin"></i></div><div class="card-title">Processando Busca OSINT...</div></div><div class="loading-skeleton"></div><div class="loading-skeleton"></div><div class="loading-skeleton"></div></div>';
        }
        
        var riskSection = document.getElementById('riskSection');
        if (riskSection) riskSection.style.display = 'block';
        
        var riskFill = document.getElementById('riskFill');
        var riskPercentage = document.getElementById('riskPercentage');
        var alertList = document.getElementById('alertList');
        
        if (riskFill) riskFill.style.width = '0%';
        if (riskPercentage) riskPercentage.textContent = '0%';
        if (alertList) alertList.innerHTML = '<li class="alert-item">Analisando fontes de dados...</li>';
    }
    
    function generateOSINTResults(query, type) {
        var timestamp = new Date().toLocaleDateString('pt-BR');
        var cpf = generateCPF();
        var cnpj = generateCNPJ();
        
        return {
            query: query,
            type: type,
            timestamp: timestamp,
            personal: {
                nome: query,
                cpf: cpf,
                dataNascimento: '15/03/1985',
                situacao: 'Regular',
                fonte: 'Receita Federal'
            },
            business: {
                razaoSocial: query + ' Ltda',
                cnpj: cnpj,
                situacao: 'Ativa',
                porte: 'Medio',
                fonte: 'Receita Federal'
            },
            financial: {
                score: Math.floor(Math.random() * 300) + 600,
                restricoes: Math.floor(Math.random() * 3),
                dividas: Math.floor(Math.random() * 50000),
                fonte: 'Serasa Experian'
            },
            social: {
                linkedin: 'Perfil encontrado',
                facebook: '2 perfis',
                instagram: '1 perfil',
                risco: 'Baixo'
            },
            legal: {
                processos: Math.floor(Math.random() * 5),
                certidoes: 3,
                debitos: Math.floor(Math.random() * 2),
                status: 'Regular'
            },
            contact: {
                telefones: Math.floor(Math.random() * 3) + 1,
                emails: Math.floor(Math.random() * 4) + 1,
                endereco: 'Sao Paulo, SP',
                fonte: 'Bases publicas'
            }
        };
    }
    
    function displayResults(data) {
        var grid = document.getElementById('resultsGrid');
        if (!grid) return;
        
        var html = '';
        
        // Personal Information Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-user"></i></div><div class="card-title">Informacoes Pessoais</div><span class="status-badge status-clear">VERIFICADO</span></div>';
        html += '<div class="info-row"><span class="info-label">Nome:</span><span class="info-value">' + data.personal.nome + '</span></div>';
        html += '<div class="info-row"><span class="info-label">CPF:</span><span class="info-value">' + data.personal.cpf + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Nascimento:</span><span class="info-value">' + data.personal.dataNascimento + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Status:</span><span class="info-value">' + data.personal.situacao + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Fonte:</span><span class="info-value">' + data.personal.fonte + '</span></div></div>';
        
        // Business Information Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-building"></i></div><div class="card-title">Informacoes Empresariais</div><span class="status-badge status-warning">ATENCAO</span></div>';
        html += '<div class="info-row"><span class="info-label">Razao Social:</span><span class="info-value">' + data.business.razaoSocial + '</span></div>';
        html += '<div class="info-row"><span class="info-label">CNPJ:</span><span class="info-value">' + data.business.cnpj + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Situacao:</span><span class="info-value">' + data.business.situacao + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Porte:</span><span class="info-value">' + data.business.porte + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Fonte:</span><span class="info-value">' + data.business.fonte + '</span></div></div>';
        
        // Financial Information Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-dollar-sign"></i></div><div class="card-title">Informacoes Financeiras</div><span class="status-badge status-high-risk">ALTO RISCO</span></div>';
        html += '<div class="info-row"><span class="info-label">Score Credito:</span><span class="info-value">' + data.financial.score + '/1000</span></div>';
        html += '<div class="info-row"><span class="info-label">Restricoes:</span><span class="info-value">' + data.financial.restricoes + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Dividas:</span><span class="info-value">R$ ' + data.financial.dividas.toLocaleString('pt-BR') + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Fonte:</span><span class="info-value">' + data.financial.fonte + '</span></div></div>';
        
        // Social Media Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-hashtag"></i></div><div class="card-title">Redes Sociais</div><span class="status-badge status-clear">LIMPO</span></div>';
        html += '<div class="info-row"><span class="info-label">LinkedIn:</span><span class="info-value">' + data.social.linkedin + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Facebook:</span><span class="info-value">' + data.social.facebook + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Instagram:</span><span class="info-value">' + data.social.instagram + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Risco Social:</span><span class="info-value">' + data.social.risco + '</span></div></div>';
        
        // Legal Documents Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-file-alt"></i></div><div class="card-title">Documentos Legais</div><span class="status-badge status-warning">REVISAR</span></div>';
        html += '<div class="info-row"><span class="info-label">Processos:</span><span class="info-value">' + data.legal.processos + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Certidoes:</span><span class="info-value">' + data.legal.certidoes + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Debitos:</span><span class="info-value">' + data.legal.debitos + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Status:</span><span class="info-value">' + data.legal.status + '</span></div></div>';
        
        // Contact Information Card
        html += '<div class="result-card"><div class="card-header"><div class="card-icon"><i class="fas fa-phone"></i></div><div class="card-title">Informacoes de Contato</div><span class="status-badge status-clear">VERIFICADO</span></div>';
        html += '<div class="info-row"><span class="info-label">Telefones:</span><span class="info-value">' + data.contact.telefones + '</span></div>';
        html += '<div class="info-row"><span class="info-label">E-mails:</span><span class="info-value">' + data.contact.emails + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Endereco:</span><span class="info-value">' + data.contact.endereco + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Fonte:</span><span class="info-value">' + data.contact.fonte + '</span></div></div>';
        
        grid.innerHTML = html;
        
        // Display risk assessment
        displayRiskAssessment(data);
        
        // Display timeline
        displayTimeline(data);
    }
    
    function displayRiskAssessment(data) {
        var riskScore = Math.floor(Math.random() * 60) + 20;
        
        setTimeout(function() {
            var riskFill = document.getElementById('riskFill');
            var riskPercentage = document.getElementById('riskPercentage');
            if (riskFill) riskFill.style.width = riskScore + '%';
            if (riskPercentage) riskPercentage.textContent = riskScore + '%';
        }, 500);
        
        var alerts = [];
        if (riskScore > 60) {
            alerts.push({type: 'alert-high', text: 'ALTO RISCO: Multiplas restricoes financeiras encontradas'});
        }
        if (riskScore > 40) {
            alerts.push({type: 'alert-medium', text: 'MEDIO RISCO: Processos judiciais em andamento'});
        }
        alerts.push({type: 'alert-low', text: 'BAIXO RISCO: Historico de credito estavel'});
        
        var alertList = document.getElementById('alertList');
        if (alertList) {
            alertList.innerHTML = '';
            for (var i = 0; i < alerts.length; i++) {
                alertList.innerHTML += '<li class="alert-item ' + alerts[i].type + '">' + alerts[i].text + '</li>';
            }
        }
    }
    
    function displayTimeline(data) {
        var events = [
            {date: new Date().toLocaleDateString('pt-BR'), text: 'Busca OSINT realizada - Background Check Pro'},
            {date: '2024-01-15', text: 'Atualizacao cadastral - Receita Federal'},
            {date: '2023-11-20', text: 'Consulta credito - Serasa'},
            {date: '2023-09-10', text: 'Verificacao documentos - Detran'},
            {date: '2023-06-05', text: 'Registro profissional - Conselho Regional'}
        ];
        
        var content = document.getElementById('timelineContent');
        if (content) {
            content.innerHTML = '';
            for (var i = 0; i < events.length; i++) {
                content.innerHTML += '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">' + events[i].date + '</div><div class="timeline-text">' + events[i].text + '</div></div></div>';
            }
        }
        
        var timelineSection = document.getElementById('timelineSection');
        if (timelineSection) timelineSection.style.display = 'block';
    }
    
    function generateCPF() {
        var base = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        var dv1 = Math.floor(Math.random() * 10);
        var dv2 = Math.floor(Math.random() * 10);
        return base.substring(0, 3) + '.' + base.substring(3, 6) + '.' + base.substring(6, 9) + '-' + dv1 + dv2;
    }
    
    function generateCNPJ() {
        var base = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
        return base.substring(0, 2) + '.' + base.substring(2, 5) + '.' + base.substring(5, 8) + '/' + base.substring(8, 12) + '-' + base.substring(12, 14);
    }
    
    // Initialize
    function init() {
        console.log('BCP OSINT System initialized');
    }
    
    // Public API
    return {
        init: init,
        setSearchType: setSearchType,
        performSearch: performSearch
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    BCP.init();
    console.log('Background Check Pro OSINT System v3.0 ready');
});
