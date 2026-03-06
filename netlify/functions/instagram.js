// ============================================================================
// NETLIFY FUNCTION - Instagram Search API
// Background Check Pro - Professional OSINT Verification
// ============================================================================

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const username = event.queryStringParameters.username || event.body?.username;
        
        if (!username) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Username é obrigatório' })
            };
        }

        const cleanUsername = username.replace('@', '');
        
        // Try to get Instagram profile data
        // Note: Instagram Graph API requires access token
        // This is a simplified version that returns available data
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: {
                    username: cleanUsername,
                    found: false,
                    message: 'Instagram API requires Facebook Business verification',
                    alternative: {
                        method: 'web_scraping',
                        url: `https://www.instagram.com/${cleanUsername}/`,
                        note: 'Profile may require authentication to view'
                    },
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('Instagram search error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Erro na busca do Instagram'
            })
        };
    }
};
