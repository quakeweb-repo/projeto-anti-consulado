import axios from 'axios';

// Serviço que fornece dados simulados para mineração on-demand.
export const getGeosampaData = () => ({
  zona: '03-25',
  riscos: ['Declividade acentuada', 'Proximidade manancial'],
  restricoes: ['Área de preservação >1km'],
  nota: 'Dados extraídos via GEOSAMPA REST (simulado)'
});

// tentativa de buscar de fato dados geográficos em tempo real
export const getGeosampaDataLive = async () => {
  try {
    // exemplar: consulta JSON hipotético do GEOSAMPA
    const resp = await axios.get('https://geosampa.prefeitura.sp.gov.br/geosampa/rest/whatever?coord=-23.629054,-46.6978932');
    return resp.data;
  } catch (err) {
    console.warn('erro live geosampa, retornando simulado', err.message);
    return getGeosampaData();
  }
};

export const getPhotoCollection = () => ({
  images: [
    'https://via.placeholder.com/400x200?text=Fachada+Consulado',
    'https://via.placeholder.com/400x200?text=Entrada+Principal',
    'https://via.placeholder.com/400x200?text=Saída+de+Incêndio+Norte'
  ],
  nota: 'Coleção de fotos públicas e vigilância (simulado)'
});

export const getPhotoCollectionLive = async () => {
  try {
    // exemplo de scraping real (podemos usar axios + cheerio)
    const resp = await axios.get('https://saopaulo.ussembassy.gov');
    // parse minimal: buscamos imagens com alt=Consulado etc (pseudo)
    return { images: ['https://via.placeholder.com/400x200?text=Live+Photo'], nota: 'Extraído do site oficial (simulado live)'};
  } catch (err) {
    console.warn('erro live photos', err.message);
    return getPhotoCollection();
  }
};

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
