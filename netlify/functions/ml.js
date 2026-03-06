// ============================================================================
// NETLIFY FUNCTION - ML Analysis API
// Background Check Pro - TensorFlow.js Equivalent
// ============================================================================

exports.handler = async function(event, context) {
    try {
        const data = event.queryStringParameters.data ? JSON.parse(event.queryStringParameters.data) : event.body?.data;
        
        if (!data) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Data is required' })
            };
        }

        // Perform ML analysis
        const features = extractFeatures(data);
        const prediction = performPrediction(features);
        const riskLevel = classifyRisk(prediction);
        const recommendations = generateRecommendations(prediction, data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: {
                    prediction: prediction,
                    riskLevel: riskLevel,
                    confidence: Math.max(...prediction) * 100,
                    recommendations: recommendations,
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('ML analysis error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'ML analysis failed'
            })
        };
    }
};

function extractFeatures(data) {
    const features = [];
    
    // Name complexity
    const nameLength = (data.nome || '').length;
    features.push(Math.min(1, nameLength / 50));
    
    // Document pattern
    const hasDocument = data.cpf || data.documento ? 1 : 0;
    features.push(hasDocument);
    
    // Age risk
    const age = data.idade || 30;
    if (age < 18) features.push(0.4);
    else if (age > 65) features.push(0.3);
    else features.push(0.1);
    
    // Default values for remaining features
    features.push(0.5, 0.5, 0.5, 0.5, 0.5);
    
    return features;
}

function performPrediction(features) {
    // Simple neural network simulation
    const weights = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.2, 0.3, 0.4, 0.5, 0.6],
        [0.3, 0.4, 0.5, 0.6, 0.7],
        [0.4, 0.5, 0.6, 0.7, 0.8]
    ];
    
    let output = 0;
    for (let i = 0; i < features.length; i++) {
        output += features[i] * weights[0][i % 5];
    }
    
    return [Math.min(1, output), 1 - Math.min(1, output)];
}

function classifyRisk(prediction) {
    const riskScore = prediction[0];
    if (riskScore < 0.3) return 'Baixo';
    if (riskScore < 0.6) return 'Médio';
    return 'Alto';
}

function generateRecommendations(prediction, data) {
    const recommendations = [];
    const riskScore = prediction[0];
    
    if (riskScore > 0.7) {
        recommendations.push({
            priority: 'Alta',
            action: 'Investigação aprofundada recomendada',
            reason: 'Alto risco detectado'
        });
    } else if (riskScore > 0.4) {
        recommendations.push({
            priority: 'Média',
            action: 'Verificação adicional recomendada',
            reason: 'Risco moderado detectado'
        });
    } else {
        recommendations.push({
            priority: 'Baixa',
            action: 'Verificação padrão suficiente',
            reason: 'Baixo risco detectado'
        });
    }
    
    return recommendations;
}
