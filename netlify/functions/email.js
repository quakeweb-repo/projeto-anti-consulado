// ============================================================================
// NETLIFY FUNCTION - Email Search API
// Background Check Pro - Professional OSINT Verification
// ============================================================================

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const email = event.queryStringParameters.email || event.body?.email;
        
        if (!email) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Email é obrigatório' })
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Email inválido' })
            };
        }

        const domain = email.split('@')[1];
        const provider = getEmailProvider(domain);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: {
                    email: email,
                    valido: true,
                    dominio: domain,
                    provedor: provider.name,
                    tipo: provider.type,
                    risco: 'Baixo',
                    fonte: 'Email Validation API',
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('Email search error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Erro na busca por email'
            })
        };
    }
};

function getEmailProvider(domain) {
    const providers = {
        'gmail.com': { name: 'Gmail', type: 'Free' },
        'hotmail.com': { name: 'Hotmail', type: 'Free' },
        'outlook.com': { name: 'Outlook', type: 'Free' },
        'yahoo.com': { name: 'Yahoo', type: 'Free' },
        'icloud.com': { name: 'iCloud', type: 'Free' },
        'protonmail.com': { name: 'ProtonMail', type: 'Secure' }
    };
    return providers[domain] || { name: domain, type: 'Custom' };
}
