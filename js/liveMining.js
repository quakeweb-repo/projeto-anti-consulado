// ============================================================================
// LIVE AJAX MINING - Real-time Data Processing
// Background Check Pro - Superior to BuscaPrime
// GitHub Pages Compatible Version
// ============================================================================

class LiveMiningManager {
    constructor() {
        this.activeRequests = new Map();
        this.updateIntervals = new Map();
        this.cache = new Map();
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.updateInterval = 5000; // 5 seconds
        this.isGitHubPages = this.detectGitHubPages();
        this.init();
    }

    detectGitHubPages() {
        return window.location.hostname === 'quakeweb-repo.github.io' || 
               window.location.hostname.includes('github.io');
    }

    init() {
        this.setupEventListeners();
        this.setupWebSocketListeners();
        this.setupAutoRefresh();
        console.log('LiveMiningManager initialized');
    }

    // ============================================================================
    // PROGRESS INDICATORS
    // ============================================================================

    initializeProgressIndicators() {
        // Initialize progress indicators if they exist
        var progressElements = document.querySelectorAll('.progress');
        var i;
        for (i = 0; i < progressElements.length; i++) {
            progressElements[i].style.width = '0%';
        }
    }

    updateProgressIndicator(elementId, percentage) {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.width = percentage + '%';
        }
    }

    // ============================================================================
    // EVENT LISTENERS SETUP
    // ============================================================================

    setupEventListeners() {
        // Search form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'searchForm') {
                e.preventDefault();
                this.handleLiveSearch();
            }
        });

        // Real-time input validation
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.handleRealTimeValidation(e.target.value);
        });

        // Depth level changes
        document.getElementById('depthSelect')?.addEventListener('change', (e) => {
            this.updateSearchDepth(e.target.value);
        });

        // Search type changes
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSearchTypeChange(e.target.dataset.type);
            });
        });

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Network status changes
        window.addEventListener('online', () => {
            this.handleNetworkReconnect();
        });

        window.addEventListener('offline', () => {
            this.handleNetworkDisconnect();
        });
    }

    // ============================================================================
    // WEBSOCKET SETUP FOR REAL-TIME UPDATES
    // ============================================================================

    setupWebSocketListeners() {
        // WebSocket connection for real-time mining updates
        // Skip WebSocket on GitHub Pages (static hosting)
        if (!this.isGitHubPages) {
            this.connectWebSocket();
        } else {
            console.log('GitHub Pages detected - using polling instead of WebSocket');
        }
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/mining`;
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                console.log('WebSocket connected for live mining');
                this.websocketConnections.set('main', ws);
            };

            ws.onmessage = (event) => {
                this.handleWebSocketMessage(JSON.parse(event.data));
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected, attempting reconnect...');
                setTimeout(() => this.connectWebSocket(), 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.log('WebSocket not available, falling back to polling');
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'mining_update':
                this.updateMiningProgress(data);
                break;
            case 'result_update':
                this.updateResults(data);
                break;
            case 'error':
                this.handleMiningError(data);
                break;
            case 'complete':
                this.handleMiningComplete(data);
                break;
        }
    }

    // ============================================================================
    // LIVE SEARCH HANDLING
    // ============================================================================

    async handleLiveSearch() {
        const query = document.getElementById('searchInput').value;
        const searchType = this.getCurrentSearchType();
        const depth = document.getElementById('depthSelect').value;
        const state = document.getElementById('stateSelect')?.value;

        if (!query.trim()) {
            this.showError('Por favor, digite um termo para pesquisa');
            return;
        }

        // Generate unique request ID
        const requestId = this.generateRequestId();
        
        // Show loading state
        this.showLoadingState(requestId);
        
        // Start progress tracking
        this.startProgressTracking(requestId);

        try {
            // For GitHub Pages, use mock data with simulation
            if (this.isGitHubPages) {
                await this.simulateLiveSearch(query, searchType, depth, state, requestId);
            } else {
                // Determine appropriate endpoint
                const endpoint = this.getEndpoint(searchType, query);
                
                // Make initial request
                const response = await this.makeLiveRequest(endpoint, {
                    query,
                    type: searchType,
                    depth,
                    state,
                    requestId,
                    live: true
                });

                if (response.ok) {
                    const data = await response.json();
                    this.handleInitialResponse(data, requestId);
                    
                    // Start live updates
                    this.startLiveUpdates(requestId, data);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }
        } catch (error) {
            this.handleSearchError(error, requestId);
        }
    }

    // ============================================================================
    // REAL-TIME VALIDATION
    // ============================================================================

    async handleRealTimeValidation(value) {
        if (value.length < 3) {
            this.hideValidationResults();
            return;
        }

        const searchType = this.getCurrentSearchType();
        const cacheKey = `validation_${searchType}_${value}`;

        if (this.cache.has(cacheKey)) {
            this.showValidationResults(this.cache.get(cacheKey));
            return;
        }

        try {
            if (this.isGitHubPages) {
                // Mock validation for GitHub Pages
                const mockData = this.getMockValidationData(searchType, value);
                this.cache.set(cacheKey, mockData);
                this.showValidationResults(mockData);
            } else {
                const endpoint = this.getValidationEndpoint(searchType);
                const response = await fetch(`${endpoint}/${encodeURIComponent(value)}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.cache.set(cacheKey, data);
                    this.showValidationResults(data);
                }
            }
        } catch (error) {
            // Silently fail validation
            console.warn('Validation failed:', error);
        }
    }

    showValidationResults(data) {
        const existingResults = document.getElementById('validationResults');
        if (existingResults) {
            existingResults.remove();
        }

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'validationResults';
        resultsDiv.className = 'validation-results';
        resultsDiv.innerHTML = this.formatValidationResults(data);
        
        document.querySelector('.search-section').appendChild(resultsDiv);
    }

    hideValidationResults() {
        const results = document.getElementById('validationResults');
        if (results) {
            results.remove();
        }
    }

    // ============================================================================
    // PROGRESS TRACKING
    // ============================================================================

    startProgressTracking(requestId) {
        const progressData = {
            requestId,
            startTime: Date.now(),
            currentStep: 0,
            totalSteps: this.getTotalSteps(),
            status: 'running'
        };

        this.activeRequests.set(requestId, progressData);
        this.updateProgressDisplay(progressData);
    }

    updateProgressDisplay(progressData) {
        const percentage = Math.round((progressData.currentStep / progressData.totalSteps) * 100);
        const elapsed = Date.now() - progressData.startTime;
        const estimated = progressData.currentStep > 0 ? 
            (elapsed / progressData.currentStep) * progressData.totalSteps : 0;
        const remaining = Math.max(0, estimated - elapsed);

        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
        }

        // Update status text
        const statusText = document.getElementById('progressStatus');
        if (statusText) {
            statusText.textContent = this.getProgressMessage(progressData.currentStep);
        }

        // Update time estimates
        const timeRemaining = document.getElementById('timeRemaining');
        if (timeRemaining) {
            timeRemaining.textContent = this.formatTime(remaining);
        }
    }

    getProgressMessage(step) {
        const messages = [
            'Iniciando análise...',
            'Validando dados de entrada...',
            'Conectando às APIs...',
            'Extraindo dados do Instagram...',
            'Analisando redes sociais...',
            'Verificando documentos...',
            'Calculando score de risco...',
            'Processando resultados...',
            'Gerando relatório...',
            'Finalizando análise...'
        ];
        return messages[step] || 'Processando...';
    }

    // ============================================================================
    // LIVE UPDATES
    // ============================================================================

    startLiveUpdates(requestId, initialData) {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/mining/status/${requestId}`);
                const data = await response.json();

                if (data.status === 'complete') {
                    clearInterval(interval);
                    this.handleMiningComplete(data);
                } else if (data.status === 'error') {
                    clearInterval(interval);
                    this.handleMiningError(data);
                } else {
                    this.updateMiningProgress(data);
                }
            } catch (error) {
                console.error('Update failed:', error);
            }
        }, this.updateInterval);

        this.updateIntervals.set(requestId, interval);
    }

    updateMiningProgress(data) {
        const progressData = this.activeRequests.get(data.requestId);
        if (progressData) {
            progressData.currentStep = data.step || progressData.currentStep + 1;
            this.updateProgressDisplay(progressData);
        }

        // Update partial results
        if (data.partialResults) {
            this.displayPartialResults(data.partialResults);
        }

        // Update specific components
        if (data.component) {
            this.updateComponent(data.component, data.data);
        }
    }

    displayPartialResults(results) {
        const resultsGrid = document.getElementById('resultsGrid');
        if (!resultsGrid) return;

        // Add or update result cards with animation
        results.forEach(result => {
            const existingCard = document.getElementById(`card-${result.id}`);
            if (existingCard) {
                this.updateResultCard(existingCard, result);
            } else {
                const newCard = this.createResultCard(result);
                resultsGrid.appendChild(newCard);
                this.animateCardIn(newCard);
            }
        });
    }

    // ============================================================================
    // RESULT HANDLING
    // ============================================================================

    handleInitialResponse(data, requestId) {
        // Show initial results immediately
        if (data.results) {
            this.displayPartialResults(data.results);
        }

        // Setup risk assessment
        if (data.riskData) {
            this.setupRiskAssessment(data.riskData);
        }

        // Setup timeline
        if (data.timeline) {
            this.setupTimeline(data.timeline);
        }
    }

    handleMiningComplete(data) {
        const progressData = this.activeRequests.get(data.requestId);
        if (progressData) {
            progressData.status = 'complete';
            this.updateProgressDisplay(progressData);
        }

        // Clean up
        this.cleanupRequest(data.requestId);

        // Show completion animation
        this.showCompletionAnimation();

        // Display final results
        if (data.finalResults) {
            this.displayFinalResults(data.finalResults);
        }

        // Enable export options
        this.enableExportOptions(data.requestId);
    }

    handleMiningError(data) {
        const progressData = this.activeRequests.get(data.requestId);
        if (progressData) {
            progressData.status = 'error';
        }

        this.cleanupRequest(data.requestId);
        this.showError(data.error || 'Ocorreu um erro durante a análise');
    }

    // ============================================================================
    // COMPONENT UPDATES
    // ============================================================================

    updateComponent(component, data) {
        switch (component) {
            case 'instagram':
                this.updateInstagramCard(data);
                break;
            case 'risk':
                this.updateRiskAssessment(data);
                break;
            case 'timeline':
                this.updateTimeline(data);
                break;
            case 'social':
                this.updateSocialMediaCard(data);
                break;
            case 'documents':
                this.updateDocumentsCard(data);
                break;
        }
    }

    updateInstagramCard(data) {
        const card = document.getElementById('card-instagram');
        if (!card) return;

        const profileInfo = card.querySelector('.profile-info');
        if (profileInfo && data.profile) {
            profileInfo.innerHTML = this.formatInstagramProfile(data.profile);
        }

        const metrics = card.querySelector('.metrics-grid');
        if (metrics && data.metrics) {
            metrics.innerHTML = this.formatInstagramMetrics(data.metrics);
        }
    }

    updateRiskAssessment(data) {
        const riskMeter = document.getElementById('riskMeter');
        if (riskMeter && data.score !== undefined) {
            const fillElement = riskMeter.querySelector('.risk-fill');
            const percentageElement = riskMeter.querySelector('.risk-percentage');
            
            if (fillElement) {
                fillElement.style.width = `${data.score}%`;
                fillElement.className = `risk-fill ${this.getRiskLevel(data.score)}`;
            }
            
            if (percentageElement) {
                percentageElement.textContent = `${data.score}%`;
            }
        }

        // Update alerts
        if (data.alerts) {
            this.updateRiskAlerts(data.alerts);
        }
    }

    updateTimeline(data) {
        const timelineContainer = document.getElementById('timelineContent');
        if (!timelineContainer) return;

        const newEvent = this.createTimelineEvent(data);
        timelineContainer.appendChild(newEvent);
        this.animateTimelineEvent(newEvent);
    }

    // ============================================================================
    // UI HELPERS
    // ============================================================================

    showLoadingState(requestId) {
        const resultsGrid = document.getElementById('resultsGrid');
        if (!resultsGrid) return;

        resultsGrid.innerHTML = `
            <div class="loading-container" id="loading-${requestId}">
                <div class="progress-section">
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progressBar" style="width: 0%">0%</div>
                    </div>
                    <div class="progress-info">
                        <span id="progressStatus">Iniciando análise...</span>
                        <span id="timeRemaining">Calculando...</span>
                    </div>
                </div>
                <div class="loading-cards">
                    ${this.createLoadingCards()}
                </div>
            </div>
        `;
    }

    createLoadingCards() {
        const cardTypes = ['instagram', 'social', 'documents', 'financial', 'risk'];
        return cardTypes.map(type => `
            <div class="result-card loading" id="loading-card-${type}">
                <div class="card-header">
                    <div class="card-icon"><i class="fas fa-spinner fa-spin"></i></div>
                    <div class="card-title">${this.getCardTitle(type)}</div>
                    <span class="status-badge">PROCESSANDO</span>
                </div>
                <div class="loading-skeletons">
                    ${Array(3).fill('<div class="loading-skeleton"></div>').join('')}
                </div>
            </div>
        `).join('');
    }

    createResultCard(data) {
        const card = document.createElement('div');
        card.id = `card-${data.id}`;
        card.className = 'result-card';
        card.innerHTML = this.formatResultCard(data);
        return card;
    }

    animateCardIn(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

    animateTimelineEvent(event) {
        event.style.opacity = '0';
        event.style.transform = 'translateX(-20px)';
        
        requestAnimationFrame(() => {
            event.style.transition = 'all 0.3s ease';
            event.style.opacity = '1';
            event.style.transform = 'translateX(0)';
        });
    }

    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    handleSearchError(error, requestId) {
        console.error('Search error:', error);
        this.cleanupRequest(requestId);
        
        // Retry logic
        const attempts = this.retryAttempts.get(requestId) || 0;
        if (attempts < this.maxRetries) {
            this.retryAttempts.set(requestId, attempts + 1);
            setTimeout(() => this.handleLiveSearch(), 1000 * (attempts + 1));
        } else {
            this.showError('Falha na análise. Tente novamente.');
        }
    }

    showError(message) {
        const resultsGrid = document.getElementById('resultsGrid');
        if (resultsGrid) {
            resultsGrid.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="error-message">${message}</div>
                    <button class="retry-btn" onclick="liveMining.handleLiveSearch()">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getCurrentSearchType() {
        const activeBtn = document.querySelector('.type-btn.active');
        return activeBtn ? activeBtn.dataset.type : 'person';
    }

    getEndpoint(searchType, query) {
        const endpoints = {
            'person': `/api/mining/pessoa/${encodeURIComponent(query)}`,
            'company': `/api/mining/empresa/${encodeURIComponent(query)}`,
            'cpf': `/api/cpf/generate/${encodeURIComponent(query)}`,
            'phone': `/api/mining/phone/${encodeURIComponent(query)}`,
            'email': `/api/mining/email/${encodeURIComponent(query)}`,
            'instagram': `/api/instagram/profile/${encodeURIComponent(query)}`
        };
        
        return endpoints[searchType] || endpoints['person'];
    }

    getValidationEndpoint(searchType) {
        const endpoints = {
            'cpf': '/api/cpf/validate',
            'instagram': '/api/instagram/validate'
        };
        
        return endpoints[searchType];
    }

    getTotalSteps() {
        const depth = document.getElementById('depthSelect')?.value || 'standard';
        const steps = {
            'basic': 5,
            'standard': 10,
            'deep': 15,
            'comprehensive': 20
        };
        return steps[depth] || 10;
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    }

    getRiskLevel(score) {
        if (score < 30) return 'risk-low';
        if (score < 70) return 'risk-medium';
        return 'risk-high';
    }

    getCardTitle(type) {
        const titles = {
            'instagram': 'Instagram Analysis',
            'social': 'Social Media',
            'documents': 'Documents',
            'financial': 'Financial',
            'risk': 'Risk Assessment'
        };
        return titles[type] || 'Analysis';
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================

    cleanupRequest(requestId) {
        // Clear intervals
        const interval = this.updateIntervals.get(requestId);
        if (interval) {
            clearInterval(interval);
            this.updateIntervals.delete(requestId);
        }

        // Remove from active requests
        this.activeRequests.delete(requestId);
        this.retryAttempts.delete(requestId);

        // Remove loading indicators
        const loadingElement = document.getElementById(`loading-${requestId}`);
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // ============================================================================
    // AUTO-REFRESH
    // ============================================================================

    setupAutoRefresh() {
        // Auto-refresh data every 30 seconds if page is visible
        setInterval(() => {
            if (!document.hidden && this.activeRequests.size === 0) {
                this.refreshActiveData();
            }
        }, 30000);
    }

    async refreshActiveData() {
        // Refresh displayed cards with latest data
        const cards = document.querySelectorAll('.result-card[data-refreshable]');
        
        for (const card of cards) {
            const endpoint = card.dataset.endpoint;
            const cardId = card.id;
            
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    this.updateResultCard(card, data);
                }
            } catch (error) {
                console.warn(`Failed to refresh ${cardId}:`, error);
            }
        }
    }

    // ============================================================================
    // EXPORT FUNCTIONALITY
    // ============================================================================

    enableExportOptions(requestId) {
        const exportContainer = document.getElementById('exportOptions');
        if (exportContainer) {
            exportContainer.innerHTML = `
                <button class="export-btn" onclick="liveMining.exportResults('json', '${requestId}')">
                    <i class="fas fa-file-code"></i> Exportar JSON
                </button>
                <button class="export-btn" onclick="liveMining.exportResults('pdf', '${requestId}')">
                    <i class="fas fa-file-pdf"></i> Exportar PDF
                </button>
                <button class="export-btn" onclick="liveMining.shareResults('${requestId}')">
                    <i class="fas fa-share"></i> Compartilhar
                </button>
            `;
        }
    }

    async exportResults(format, requestId) {
        try {
            const response = await fetch(`/api/export/${format}/${requestId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `background-check-${requestId}.${format}`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            this.showError('Falha ao exportar resultados');
        }
    }

    async shareResults(requestId) {
        try {
            const response = await fetch(`/api/share/${requestId}`);
            if (response.ok) {
                const data = await response.json();
                const shareUrl = data.shareUrl;
                
                if (navigator.share) {
                    await navigator.share({
                        title: 'Background Check Results',
                        text: 'Confira os resultados da análise',
                        url: shareUrl
                    });
                } else {
                    navigator.clipboard.writeText(shareUrl);
                    this.showSuccess('Link copiado para a área de transferência');
                }
            }
        } catch (error) {
            this.showError('Falha ao compartilhar resultados');
        }
    }

    showSuccess(message) {
        // Show success notification
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'info': 'info-circle',
            'warning': 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ============================================================================
    // GITHUB PAGES MOCK DATA
    // ============================================================================

    async simulateLiveSearch(query, searchType, depth, state, requestId) {
        // Simulate processing time
        const totalSteps = this.getTotalSteps();
        
        for (let step = 1; step <= totalSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const progressData = {
                requestId,
                step,
                totalSteps,
                status: step === totalSteps ? 'complete' : 'running',
                partialResults: this.getMockPartialResults(searchType, query, step),
                timestamp: new Date().toISOString()
            };
            
            this.updateMiningProgress(progressData);
        }
        
        // Final results
        const finalResults = this.getMockFinalResults(searchType, query, depth, state);
        this.handleMiningComplete({
            requestId,
            finalResults,
            timestamp: new Date().toISOString()
        });
    }

    getMockValidationData(searchType, value) {
        switch (searchType) {
            case 'cpf':
                return {
                    original: value,
                    cleaned: value.replace(/[^\d]/g, ''),
                    isValid: /^\d{11}$/.test(value.replace(/[^\d]/g, '')),
                    suggestions: [],
                    errors: []
                };
            case 'instagram':
                const cleaned = value.replace('@', '').trim().toLowerCase();
                return {
                    original: value,
                    cleaned: cleaned,
                    isValid: /^[a-z0-9._]{1,30}$/.test(cleaned),
                    suggestions: cleaned.length < 3 ? [] : [`${cleaned}_official`, `the_${cleaned}`],
                    errors: cleaned.length < 3 ? ['Username too short'] : []
                };
            default:
                return { original: value, isValid: true, suggestions: [], errors: [] };
        }
    }

    getMockPartialResults(searchType, query, step) {
        const results = {};
        
        if (step >= 2) {
            results.personal = {
                id: 'personal',
                type: 'personal',
                title: 'Informações Pessoais',
                status: 'complete',
                data: {
                    name: query,
                    cpf: this.generateMockCPF(),
                    status: 'Regular',
                    lastUpdated: new Date().toLocaleDateString('pt-BR')
                }
            };
        }
        
        if (step >= 4) {
            results.instagram = {
                id: 'instagram',
                type: 'instagram',
                title: 'Instagram Analysis',
                status: 'complete',
                data: {
                    followers: Math.floor(Math.random() * 50000) + 1000,
                    following: Math.floor(Math.random() * 5000) + 100,
                    posts: Math.floor(Math.random() * 1000) + 50,
                    engagementRate: (Math.random() * 5 + 1).toFixed(2) + '%'
                }
            };
        }
        
        if (step >= 6) {
            results.social = {
                id: 'social',
                type: 'social',
                title: 'Redes Sociais',
                status: 'complete',
                data: {
                    platforms: ['LinkedIn', 'Facebook', 'Twitter'],
                    profiles: Math.floor(Math.random() * 5) + 1,
                    riskLevel: 'low'
                }
            };
        }
        
        if (step >= 8) {
            results.financial = {
                id: 'financial',
                type: 'financial',
                title: 'Informações Financeiras',
                status: 'complete',
                data: {
                    score: Math.floor(Math.random() * 300) + 500,
                    restrictions: Math.random() > 0.7 ? 1 : 0,
                    accounts: Math.floor(Math.random() * 3) + 1
                }
            };
        }
        
        return results;
    }

    getMockFinalResults(searchType, query, depth, state) {
        return {
            query,
            searchType,
            depth,
            state,
            timestamp: new Date().toISOString(),
            results: {
                personal: {
                    name: query,
                    cpf: this.generateMockCPF(),
                    status: 'Regular',
                    lastUpdated: new Date().toLocaleDateString('pt-BR')
                },
                instagram: {
                    username: query.toLowerCase().replace(/\s/g, '_'),
                    followers: Math.floor(Math.random() * 50000) + 1000,
                    following: Math.floor(Math.random() * 5000) + 100,
                    posts: Math.floor(Math.random() * 1000) + 50,
                    engagementRate: (Math.random() * 5 + 1).toFixed(2) + '%',
                    verified: Math.random() > 0.8,
                    businessAccount: Math.random() > 0.6
                },
                risk: {
                    score: Math.floor(Math.random() * 60) + 20,
                    level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    alerts: [
                        { type: 'info', message: 'Perfil verificado com sucesso' },
                        { type: 'warning', message: 'Baixa atividade recente detectada' }
                    ]
                },
                timeline: [
                    { date: new Date().toISOString(), event: 'Análise iniciada' },
                    { date: new Date(Date.now() - 86400000).toISOString(), event: 'Dados atualizados' }
                ]
            }
        };
    }

    generateMockCPF() {
        const base = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        const dv1 = Math.floor(Math.random() * 10);
        const dv2 = Math.floor(Math.random() * 10);
        return `${base.substring(0, 3)}.${base.substring(3, 6)}.${base.substring(6, 9)}-${dv1}${dv2}`;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let liveMining;

document.addEventListener('DOMContentLoaded', () => {
    liveMining = new LiveMiningManager();
    
    // Make it globally available
    window.liveMining = liveMining;
    
    console.log('Live Mining System initialized');
});

// ============================================================================
// FALLBACK FOR OLDER BROWSERS
// ============================================================================

if (!window.LiveMiningManager) {
    console.warn('Live mining not supported in this browser');
}
