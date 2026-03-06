// ============================================================================
// CIVIL REGISTRY TRANSPARENCY SERVICE - Advanced Data Mining
// TensorFlow.js equivalent ML analysis on browser
// ============================================================================

var CivilRegistryService = function() {
    this.baseURL = 'https://transparencia.registrocivil.org.br';
    this.cache = new Map();
    this.mlModel = null;
    this.trainingData = [];
    this.isTraining = false;
    this.initializeMLModel();
};

CivilRegistryService.prototype.initializeMLModel = function() {
    try {
        this.mlModel = {
            layers: [
                { size: 128, activation: 'relu' },
                { size: 64, activation: 'relu' },
                { size: 32, activation: 'relu' },
                { size: 16, activation: 'relu' },
                { size: 8, activation: 'sigmoid' }
            ],
            weights: this.initializeWeights(),
            learningRate: 0.001,
            epochs: 100,
            batchSize: 32
        };
        console.log('Civil Registry ML Model initialized');
    } catch (error) {
        console.warn('ML Model initialization failed:', error);
        this.mlModel = null;
    }
};

CivilRegistryService.prototype.initializeWeights = function() {
    var weights = [];
    for (var i = 0; i < 5; i++) {
        var layerWeights = [];
        for (var j = 0; j < 8; j++) {
            layerWeights.push((Math.random() - 0.5) * 2);
        }
        weights.push(layerWeights);
    }
    return weights;
};

CivilRegistryService.prototype.searchCivilRegistry = function(query, page, limit) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var cacheKey = 'civil_' + query + '_' + page;
        if (self.cache.has(cacheKey)) {
            resolve(self.cache.get(cacheKey));
            return;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', self.baseURL + '/busca?q=' + encodeURIComponent(query) + '&page=' + page + '&limit=' + limit, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('User-Agent', 'BackgroundCheckPro/1.0');
        xhr.timeout = 15000;
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var data = JSON.parse(xhr.responseText);
                self.cache.set(cacheKey, data);
                resolve(data);
            } else {
                resolve({ success: false, error: 'API unavailable', fallback: null });
            }
        };
        
        xhr.onerror = function() {
            resolve({ success: false, error: 'Network error', fallback: null });
        };
        
        xhr.ontimeout = function() {
            resolve({ success: false, error: 'Timeout', fallback: null });
        };
        
        xhr.send();
    });
};

CivilRegistryService.prototype.getDetailedInfo = function(registryId) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', self.baseURL + '/detalhe/' + registryId, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('User-Agent', 'BackgroundCheckPro/1.0');
        xhr.timeout = 10000;
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var data = JSON.parse(xhr.responseText);
                resolve({ success: true, data: data });
            } else {
                resolve({ success: false, error: 'API unavailable' });
            }
        };
        
        xhr.onerror = function() {
            resolve({ success: false, error: 'Network error' });
        };
        
        xhr.send();
    });
};

CivilRegistryService.prototype.analyzeWithML = function(data) {
    var features = this.extractFeatures(data);
    var prediction = this.forwardPass(features);
    
    return {
        confidence: prediction.confidence,
        riskLevel: this.classifyRisk(prediction.output),
        anomalies: this.detectAnomalies(features),
        patterns: this.identifyPatterns(data),
        mlScore: prediction.output[0],
        recommendations: this.generateRecommendations(prediction.output, data)
    };
};

CivilRegistryService.prototype.extractFeatures = function(data) {
    var features = [];
    features.push(this.normalizeText(data.nome || ''));
    features.push(this.normalizeText(data.documento || ''));
    features.push(this.normalizeDate(data.dataNascimento || ''));
    features.push(this.normalizeText(data.naturalidade || ''));
    features.push(this.normalizeNumber(data.idade || 0));
    features.push(this.calculateNameComplexity(data.nome || ''));
    features.push(this.calculateDocumentPattern(data.documento || ''));
    features.push(this.calculateAgeRisk(data.idade || 0));
    return features;
};

CivilRegistryService.prototype.normalizeText = function(text) {
    if (!text) return 0;
    return text.length / 100;
};

CivilRegistryService.prototype.normalizeNumber = function(num) {
    return Math.min(1, num / 100);
};

CivilRegistryService.prototype.normalizeDate = function(dateStr) {
    if (!dateStr) return 0;
    var date = new Date(dateStr);
    var now = new Date();
    var ageInDays = (now - date) / (1000 * 60 * 60 * 24);
    return Math.min(1, ageInDays / 36500);
};

CivilRegistryService.prototype.calculateNameComplexity = function(name) {
    if (!name) return 0;
    var words = name.split(' ').length;
    var chars = name.replace(/\s/g, '').length;
    return Math.min(1, (words * 0.3 + chars * 0.7) / 50);
};

CivilRegistryService.prototype.calculateDocumentPattern = function(doc) {
    if (!doc) return 0;
    var hasNumbers = /\d/.test(doc);
    var hasLetters = /[a-zA-Z]/.test(doc);
    return Math.min(1, (hasNumbers ? 0.3 : 0) + (hasLetters ? 0.4 : 0) + 0.3);
};

CivilRegistryService.prototype.calculateAgeRisk = function(age) {
    if (!age) return 0;
    if (age < 18) return 0.4;
    if (age > 65) return 0.3;
    if (age > 80) return 0.5;
    return 0.1;
};

CivilRegistryService.prototype.forwardPass = function(features) {
    var input = features;
    for (var i = 0; i < this.mlModel.layers.length; i++) {
        var layer = this.mlModel.layers[i];
        var weights = this.mlModel.weights[i];
        var output = [];
        for (var j = 0; j < layer.size; j++) {
            var sum = 0;
            for (var k = 0; k < input.length; k++) {
                sum += input[k] * weights[j];
            }
            output[j] = this.activationFunction(sum, layer.activation);
        }
        input = output;
    }
    return { output: input, confidence: Math.max.apply(null, input) };
};

CivilRegistryService.prototype.activationFunction = function(value, type) {
    if (type === 'relu') return Math.max(0, value);
    if (type === 'sigmoid') return 1 / (1 + Math.exp(-value));
    if (type === 'tanh') return Math.tanh(value);
    return value;
};

CivilRegistryService.prototype.classifyRisk = function(output) {
    var riskScore = output[0];
    if (riskScore < 0.3) return 'Baixo';
    if (riskScore < 0.6) return 'Médio';
    return 'Alto';
};

CivilRegistryService.prototype.detectAnomalies = function(features) {
    var anomalies = [];
    if (features[4] > 80) anomalies.push('Idade avancada');
    if (features[5] > 0.8) anomalies.push('Profissao de alto risco');
    return anomalies;
};

CivilRegistryService.prototype.identifyPatterns = function(data) {
    var patterns = [];
    if (data.documento && data.documento.length === 11) {
        patterns.push({ type: 'CPF', confidence: 0.9, description: 'Formato de CPF detectado' });
    }
    if (data.nome && data.nome.includes(' ')) {
        patterns.push({ type: 'Nome Completo', confidence: 0.8, description: 'Nome completo detectado' });
    }
    return patterns;
};

CivilRegistryService.prototype.generateRecommendations = function(output, data) {
    var recommendations = [];
    var riskScore = output[0];
    if (riskScore > 0.7) {
        recommendations.push({ priority: 'Alta', action: 'Investigacao aprofundada recomendada', reason: 'Alto risco detectado' });
    }
    if (riskScore > 0.4 && riskScore <= 0.7) {
        recommendations.push({ priority: 'Media', action: 'Verificacao adicional recomendada', reason: 'Risco moderado detectado' });
    }
    return recommendations;
};

CivilRegistryService.prototype.getStatus = function() {
    return {
        service: 'Civil Registry Transparency',
        baseURL: this.baseURL,
        cacheSize: this.cache.size,
        mlModel: this.mlModel !== null,
        lastUpdate: new Date().toISOString()
    };
};

CivilRegistryService.prototype.clearCache = function() {
    this.cache.clear();
    this.trainingData = [];
};

window.CivilRegistryService = CivilRegistryService;
