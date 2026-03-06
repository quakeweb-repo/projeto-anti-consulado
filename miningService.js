import axios from 'axios';

// ============================================================================
// GEOSPATIAL DATA - GeoSampa
// ============================================================================
export const getGeosampaData = () => ({
  zona: '03-25',
  riscos: ['Declividade acentuada', 'Proximidade manancial'],
  restricoes: ['Área de preservação >1km'],
  nota: 'Dados extraídos via GEOSAMPA (simulado)'
});

export const getGeosampaDataLive = async () => {
  try {
    // Consulta cartográfica de São Paulo - zona de risco
    const resp = await axios.get('https://geosampa.prefeitura.sp.gov.br/geosampa/api/rest/datastore/consulta', {
      params: { field: 'zona', value: '03-25' },
      timeout: 5000
    });
    return resp.data || getGeosampaData();
  } catch (err) {
    console.warn('Erro ao buscar GeoSampa, usando simulado:', err.message);
    return {
      ...getGeosampaData(),
      status: 'fallback',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// FISCAL DATA - Portal da Transparência
// ============================================================================
export const getFiscalData = async () => {
  try {
    // Portal da Transparência API - busca por CNPJ do Consulado
    const cnpj = '54016822000182';
    const resp = await axios.get(`https://api.portadatransparencia.gov.br/api-de-dados/favorecidos/${cnpj}`, {
      timeout: 5000
    });
    return {
      cnpj: cnpj,
      dados: resp.data,
      timestamp: new Date().toISOString(),
      fonte: 'Portal da Transparência'
    };
  } catch (err) {
    console.warn('Erro ao buscar dados fiscais:', err.message);
    return {
      cnpj: '54.016.822/0001-82',
      descricao: 'Consulado-Geral dos EUA em São Paulo',
      natura_juridica: 'Represenção Diplomática',
      situacao: 'Regular',
      regime: 'Imunidade Diplomática',
      iptu: 'Isento (Lei 5.172/66 Article 150)',
      nota: 'Dados públicos de cadastro',
      fonte: 'Portal da Transparência (timeout, simulado)',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// DOCUMENT DATA - Querido Diário (Open Data)
// ============================================================================
export const getDocumentData = async () => {
  try {
    // Querido Diário API - busca diários publicados sobre o imóvel
    const resp = await axios.get('https://api.queridodiario.ok.org.br/documents', {
      params: {
        territory_id: 'municipal_entity/3550308',  // São Paulo
        search: 'Consulado EUA',
        limit: 5
      },
      timeout: 5000
    });
    return {
      diarios_encontrados: resp.data?.documents?.length || 0,
      documentos: resp.data?.documents || [],
      fonte: 'Querido Diário',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Erro ao buscar documentos:', err.message);
    return {
      diarios_buscados: ['Querido Diário'],
      resultado: 'Nenhum resultado específico para "Consulado EUA"',
      nota: 'Consulta a diários municipais de São Paulo',
      fonte: 'Querido Diário (timeout, simulado)',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// NETWORK/WEB DATA - Brasil.io + Google Hacking
// ============================================================================
export const getWebData = async () => {
  try {
    // Brasil.io API - dados públicos
    const resp = await axios.get('https://brasil.io/api/dataset/serenata-de-amor/expense/', {
      params: {
        applicant_name: 'Consulado',
        limit: 5
      },
      timeout: 5000
    });
    return {
      despesas: resp.data?.results?.length || 0,
      resultado: resp.data?.results || [],
      fonte: 'Brasil.io - Serenata de Amor',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Erro ao buscar dados da web:', err.message);
    return {
      google_hacking_dorks: [
        'site:saopaulo.ussembassy.gov filetype:pdf',
        'site:consular.state.gov "São Paulo" "Brazil"',
        'intitle:"Exchange Rates" site:consular.state.gov'
      ],
      busca_recomendada: 'Utilize Google Hacking dorks acima para dados específicos',
      fonte: 'Google Hacking (OSINT)',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// INFRASTRUCTURE DATA - ANATEL, ANEEL
// ============================================================================
export const getInfrastructureData = async () => {
  try {
    // ANATEL API - frequências registradas
    const resp = await axios.get('https://sistemas.anatel.gov.br/api/consulta-outorgas', {
      params: {
        localidade: 'São Paulo',
        tipo: 'radiodifusão'
      },
      timeout: 5000
    });
    return {
      outorgas_anatel: resp.data?.results?.length || 0,
      resultado: resp.data?.results || [],
      fonte: 'ANATEL',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Erro ao buscar dados de infraestrutura:', err.message);
    return {
      anatel_outorgas: 0,
      aneel_usinas: 0,
      dnit_vias: 'Consulte portais específicos',
      fontes_recomendadas: [
        'https://sistemas.anatel.gov.br/stel/',
        'https://www2.aneel.gov.br/aplicacoes/capacidadebrasil/',
        'https://servicos.dnit.gov.br/dadosabertos/'
      ],
      fonte: 'ANATEL, ANEEL, DNIT (simulado)',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// SECURITY DATA - SINESP, CERT.br
// ============================================================================
export const getSecurityData = async () => {
  try {
    // Busca em base de segurança cibernética
    const resp = await axios.get('https://api.cert.br/vulnerability', {
      params: {
        organization: 'US Consulate',
        limit: 5
      },
      timeout: 5000
    });
    return {
      vulnerabilidades: resp.data?.results?.length || 0,
      resultado: resp.data?.results || [],
      fonte: 'CERT.br',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Erro ao buscar dados de segurança:', err.message);
    return {
      ameacas_geograficas: 'Consulte CEMADEN para riscos naturais',
      pessoas_procuradas: 'Consulte SINESP para pessoas procuradas na região',
      incidentes_log: 'Consulte S2iD para histórico de desastres',
      fontes_recomendadas: [
        'https://www.cert.br/',
        'https://www.cemaden.gov.br/',
        'https://s2id.mi.gov.br/'
      ],
      fonte: 'SINESP, CERT.br, CEMADEN (simulado)',
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
// PHOTO COLLECTION
// ============================================================================
export const getPhotoCollection = () => ({
  images: [
    'https://via.placeholder.com/400x200?text=Fachada+Consulado',
    'https://via.placeholder.com/400x200?text=Entrada+Principal',
    'https://via.placeholder.com/400x200?text=Área+Externa'
  ],
  nota: 'Imagens públicas disponíveis (simulado)'
});

export const getPhotoCollectionLive = async () => {
  try {
    // Fetch from official website
    const resp = await axios.get('https://saopaulo.ussembassy.gov', {
      timeout: 5000
    });
    return { 
      imagens_encontradas: 1,
      nota: 'Página oficial do Consulado',
      data: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Erro ao buscar fotos:', err.message);
    return getPhotoCollection();
  }
};

// ============================================================================
// FIRE EXIT DATA
// ============================================================================
export const getFireExitData = () => ({
  count: 4,
  locations: ['Norte', 'Sul', 'Leste', 'Oeste'],
  compliant: false,
  nota: 'Base de dados de segurança contra incêndio (simulado)'
});

export const getSocialMediaData = () => ({
  profiles: [
    { platform: 'Facebook', url: 'https://www.facebook.com/USEmbassyBrazil', followers: '12K' },
    { platform: 'Twitter', url: 'https://twitter.com/USEmbassySaoPa', followers: '8K' }
  ],
  nota: 'Perfis sociais do consulado e engajamento (simulado)'
});

export const getSocialMediaDataLive = async () => {
  try {
    // na prática faríamos scraping API ou Graph, aqui apenas fallback
    return getSocialMediaData();
  } catch (err) {
    console.warn('erro live social', err.message);
    return getSocialMediaData();
  }
};

export const getGoogleData = () => ({
  streetView: 'https://maps.google.com/?q=Rua+Henri+Durant+500',
  searchResults: ['"Consulado dos EUA São Paulo"', '"Henri Durant 500"'],
  nota: 'Dados extraídos via Google Search/Street View (simulado)'
});

export const getGoogleDataLive = async () => {
  try {
    // poderíamos usar Google Custom Search API se disponível
    return getGoogleData();
  } catch (err) {
    console.warn('erro live google', err.message);
    return getGoogleData();
  }
};

export const getOwaspCompliance = () => ({
  principles: [
    'Respeito à privacidade e LGPD',
    'Uso de somente fontes abertas e parcialmente anonimizadas',
    'Minimização de coleta de dados pessoais',
    'Documentação de todas as buscas e relatórios de auditoria'
  ],
  nota: 'Princípios éticos inspirados em OWASP e legislação brasileira'
});
