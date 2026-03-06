// ============================================================================
// NETLIFY FUNCTION - Civil Registry Search API
// Background Check Pro - Professional OSINT Verification
// ============================================================================

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const query = event.queryStringParameters.q || event.body?.query;
        const page = parseInt(event.queryStringParameters.page) || 1;
        const limit = parseInt(event.queryStringParameters.limit) || 20;
        
        if (!query) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Query de busca é obrigatório' })
            };
        }

        // Search Civil Registry Transparency
        const response = await axios.get(
            `https://transparencia.registrocivil.org.br/api/v1/busca`,
            {
                params: { q: query, page: page, limit: limit },
                headers: { 'Accept': 'application/json' },
                timeout: 15000
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
                data: response.data || [],
                pagination: {
                    page: page,
                    limit: limit,
                    total: response.data?.total || 0
                },
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Civil Registry search error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Erro na busca do Registro Civil'
            })
        };
    }
};
