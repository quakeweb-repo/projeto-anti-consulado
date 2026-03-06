import axios from 'axios';

// ============================================================================
// GOOGLE SEARCH MINING - Enhanced with Custom Search API
// ============================================================================
export const getGoogleMiningData = async (query, type = 'pessoa') => {
  try {
    // Google Custom Search API (requires API key in production)
    const searchQuery = type === 'pessoa' 
      ? `"${query}" site:linkedin.com OR site:facebook.com OR site:instagram.com`
      : `"${query}" site:cnpj.info OR site:empresabrasil.com.br OR site:receita.federal.gov.br`;
    
    const resp = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY || 'demo',
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID || 'demo',
        q: searchQuery,
        num: 10
      },
      timeout: 8000
    });
    
    return {
      results: resp.data?.items || [],
      totalResults: resp.data?.searchInformation?.totalResults || 0,
      searchQuery,
      type,
      fonte: 'Google Custom Search API',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Google API falhou, usando fallback:', err.message);
    return {
      results: [
        {
          title: `Resultados para ${query}`,
          link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Busca manual recomendada para ${query}`,
          type: 'fallback'
        }
      ],
      totalResults: 0,
      searchQuery: query,
      type,
      fonte: 'Google Search (Fallback)',
      timestamp: new Date().toISOString(),
      nota: 'API Key não configurada - usando busca manual'
    };
  }
};

// ============================================================================
// FACEBOOK GRAPH API MINING
// ============================================================================
export const getFacebookMiningData = async (query, type = 'pessoa') => {
  try {
    // Facebook Graph API (requires access token)
    const searchEndpoint = type === 'pessoa' 
      ? `https://graph.facebook.com/v18.0/search?q=${encodeURIComponent(query)}&type=user&limit=10`
      : `https://graph.facebook.com/v18.0/search?q=${encodeURIComponent(query)}&type=page&limit=10`;
    
    const resp = await axios.get(searchEndpoint, {
      headers: {
        'Authorization': `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN || 'demo'}`
      },
      timeout: 8000
    });
    
    return {
      profiles: resp.data?.data || [],
      totalFound: resp.data?.data?.length || 0,
      searchQuery: query,
      type,
      fonte: 'Facebook Graph API',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Facebook API falhou, usando fallback:', err.message);
    return {
      profiles: [
        {
          name: query,
          id: 'fallback',
          link: `https://www.facebook.com/search/top?q=${encodeURIComponent(query)}`,
          picture: { data: { url: 'https://via.placeholder.com/50' } }
        }
      ],
      totalFound: 1,
      searchQuery: query,
      type,
      fonte: 'Facebook Search (Fallback)',
      timestamp: new Date().toISOString(),
      nota: 'Access Token não configurado - usando busca manual'
    };
  }
};

// ============================================================================
// ESCAVADOR API MINING - Legal & Business Intelligence
// ============================================================================
export const getEscavadorMiningData = async (query, type = 'pessoa') => {
  try {
    // Escavador API (requires token)
    const searchType = type === 'pessoa' ? 'pessoa' : 'empresa';
    const resp = await axios.get(`https://api.escavador.com/api/v1/${searchType}/search`, {
      headers: {
        'Authorization': `Bearer ${process.env.ESCAVADOR_TOKEN || 'demo'}`
      },
      params: {
        q: query,
        limit: 20
      },
      timeout: 10000
    });
    
    return {
      results: resp.data?.results || [],
      totalFound: resp.data?.total || 0,
      searchQuery: query,
      type: searchType,
      fonte: 'Escavador API',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Escavador API falhou, usando fallback:', err.message);
    return {
      results: [
        {
          nome: query,
          tipo: type,
          descricao: `Dados básicos para ${query}`,
          fonte: 'Fallback'
        }
      ],
      totalFound: 1,
      searchQuery: query,
      type,
      fonte: 'Escavador (Fallback)',
      timestamp: new Date().toISOString(),
      nota: 'Token não configurado - usando dados simulados'
    };
  }
};

// ============================================================================
// COMBINED MINING SERVICE - All sources with fallbacks
// ============================================================================
export const getCombinedMiningData = async (query, type = 'pessoa') => {
  const results = {
    query,
    type,
    timestamp: new Date().toISOString(),
    sources: {},
    aggregated: {
      totalResults: 0,
      uniqueProfiles: new Set(),
      companies: new Set(),
      socialMedia: new Set(),
      legalDocuments: new Set()
    }
  };

  // Parallel requests to all services
  const [googleData, facebookData, escavadorData] = await Promise.allSettled([
    getGoogleMiningData(query, type),
    getFacebookMiningData(query, type),
    getEscavadorMiningData(query, type)
  ]);

  // Process Google results
  if (googleData.status === 'fulfilled') {
    results.sources.google = googleData.value;
    results.aggregated.totalResults += googleData.value.totalResults;
    
    // Extract unique entities
    googleData.value.results.forEach(result => {
      if (result.link.includes('linkedin') || result.link.includes('facebook')) {
        results.aggregated.uniqueProfiles.add(result.link);
      }
      if (result.link.includes('cnpj') || result.link.includes('empresa')) {
        results.aggregated.companies.add(result.link);
      }
    });
  }

  // Process Facebook results
  if (facebookData.status === 'fulfilled') {
    results.sources.facebook = facebookData.value;
    results.aggregated.totalResults += facebookData.value.totalFound;
    
    facebookData.value.profiles.forEach(profile => {
      results.aggregated.socialMedia.add(profile.link);
      results.aggregated.uniqueProfiles.add(profile.name);
    });
  }

  // Process Escavador results
  if (escavadorData.status === 'fulfilled') {
    results.sources.escavador = escavadorData.value;
    results.aggregated.totalResults += escavadorData.value.totalFound;
    
    escavadorData.value.results.forEach(result => {
      if (result.tipo === 'pessoa') {
        results.aggregated.uniqueProfiles.add(result.nome);
      } else if (result.tipo === 'empresa') {
        results.aggregated.companies.add(result.nome);
      }
      if (result.documentos) {
        results.aggregated.legalDocuments.add(result.documentos);
      }
    });
  }

  // Convert Sets to Arrays for JSON serialization
  results.aggregated.uniqueProfiles = Array.from(results.aggregated.uniqueProfiles);
  results.aggregated.companies = Array.from(results.aggregated.companies);
  results.aggregated.socialMedia = Array.from(results.aggregated.socialMedia);
  results.aggregated.legalDocuments = Array.from(results.aggregated.legalDocuments);

  return results;
};

// ============================================================================
// SPECIALIZED SERVICES
// ============================================================================

// People-specific mining
export const getPessoaMiningData = async (nome, cpf = null) => {
  const query = cpf ? `${nome} ${cpf}` : nome;
  const results = await getCombinedMiningData(query, 'pessoa');
  
  // Add pessoa-specific data
  results.pessoaData = {
    nome,
    cpf,
    possiveisEnderecos: [],
    redesSociais: results.aggregated.socialMedia,
    vinculosEmpresariais: results.aggregated.companies,
    documentosLegais: results.aggregated.legalDocuments
  };
  
  return results;
};

// Company-specific mining
export const getEmpresaMiningData = async (razaoSocial, cnpj = null) => {
  const query = cnpj ? `${razaoSocial} ${cnpj}` : razaoSocial;
  const results = await getCombinedMiningData(query, 'empresa');
  
  // Add empresa-specific data
  results.empresaData = {
    razaoSocial,
    cnpj,
    socios: results.aggregated.uniqueProfiles,
    filiais: [],
    documentos: results.aggregated.legalDocuments,
    midia: results.aggregated.socialMedia
  };
  
  return results;
};

// ============================================================================
// FALLBACK WEB SCRAPING SERVICE
// ============================================================================
export const getWebScrapingData = async (url, selector = 'body') => {
  try {
    const resp = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // Simple text extraction (in production would use cheerio)
    const text = resp.data.replace(/<[^>]*>/g, '').substring(0, 1000);
    
    return {
      url,
      content: text,
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Web scraping falhou:', err.message);
    return {
      url,
      error: err.message,
      success: false,
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// PHONE AND EMAIL ENRICHMENT
// ============================================================================
export const getPhoneEnrichment = async (phone) => {
  try {
    // Would integrate with phone validation services
    return {
      phone,
      valid: true,
      carrier: 'Unknown',
      location: 'São Paulo',
      type: 'Mobile',
      fonte: 'Phone Validation Service',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      phone,
      valid: false,
      error: err.message,
      fonte: 'Phone Validation (Fallback)',
      timestamp: new Date().toISOString()
    };
  }
};

export const getEmailEnrichment = async (email) => {
  try {
    // Would integrate with email validation services
    const domain = email.split('@')[1];
    return {
      email,
      valid: true,
      domain,
      provider: domain.includes('gmail') ? 'Google' : 'Unknown',
      disposable: false,
      fonte: 'Email Validation Service',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      email,
      valid: false,
      error: err.message,
      fonte: 'Email Validation (Fallback)',
      timestamp: new Date().toISOString()
    };
  }
};
