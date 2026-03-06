// ============================================================================
// NETLIFY FUNCTION - CPF Search API
// Background Check Pro - Professional OSINT Verification
// ============================================================================

const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const cpf = event.queryStringParameters.cpf || event.body?.cpf;
        
        if (!cpf) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'CPF é obrigatório' })
            };
        }

        const cleanCPF = cpf.replace(/\D/g, '');
        
        if (cleanCPF.length !== 11) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'CPF inválido' })
            };
        }

        // Validate CPF digits
        const isValid = validateCPF(cleanCPF);
        
        // Search Portal da Transparência
        const response = await axios.get(
            `https://api.portaldatransparencia.gov.br/api-de-dados/pessoa-fisica?cpf=${cleanCPF}`,
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
                    cpf: formatCPF(cleanCPF),
                    valido: isValid,
                    nome: response.data?.nome || 'Não encontrado',
                    dataNascimento: response.data?.dataNascimento || 'Não informado',
                    situacao: response.data?.situacao || 'Não encontrado',
                    fonte: 'Portal da Transparência',
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('CPF search error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Erro na busca por CPF'
            })
        };
    }
};

function validateCPF(cpf) {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
}

function formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
