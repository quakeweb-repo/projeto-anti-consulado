// ============================================================================
// NETLIFY FUNCTION - Person Search API
// Background Check Pro - Professional OSINT Verification
// ============================================================================

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const name = event.queryStringParameters.name || event.body?.name;
        
        if (!name) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Nome é obrigatório' })
            };
        }

        // Search Portal da Transparência
        const transparenciaResponse = await axios.get(
            `https://api.portaldatransparencia.gov.br/api-de-dados/pessoa-fisica?nome=${encodeURIComponent(name)}`,
            {
                headers: { 'Accept': 'application/json' },
                timeout: 10000
            }
        );

        // Search Civil Registry
        const civilResponse = await axios.get(
            `https://transparencia.registrocivil.org.br/api/v1/busca?q=${encodeURIComponent(name)}&limit=10`,
            {
                headers: { 'Accept': 'application/json' },
                timeout: 10000
            }
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: {
                    name: name,
                    portalTransparencia: transparenciaResponse.data || [],
                    civilRegistry: civilResponse.data || [],
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('Person search error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Erro na busca por pessoa'
            })
        };
    }
};
