// Serviço agregador de todas as categorias OSINT com mineração live

import {
    getGeosampaDataLive,
    getFiscalData,
    getDocumentData,
    getWebData,
    getInfrastructureData,
    getSecurityData,
    getPhotoCollectionLive,
    getFireExitData
} from './miningService.js';

export const getOsintCategory = async (category) => {
    try {
        // categories: infraestrutura, redes, web, documentos, fiscal, seguranca
        switch (category) {
            case 'infraestrutura':
                return {
                    geospatial: await getGeosampaDataLive(),
                    infrastructure: await getInfrastructureData(),
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'redes':
                return {
                    social_media_sources: [
                        { plataforma: 'LinkedIn', url: 'https://linkedin.com', dados: 'Perfis e empresas' },
                        { plataforma: 'Instagram', url: 'https://instagram.com', dados: 'Imagens georreferenciadas' },
                        { plataforma: 'Twitter', url: 'https://twitter.com', dados: 'Tweets temáticos' },
                        { plataforma: 'Facebook', url: 'https://facebook.com', dados: 'Páginas e discussões' },
                        { plataforma: 'TikTok', url: 'https://tiktok.com', dados: 'Conteúdo multimídia' }
                    ],
                    fotos: await getPhotoCollectionLive(),
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'web':
                return {
                    web_sources: await getWebData(),
                    google_hacking: {
                        dorks: [
                            'site:saopaulo.ussembassy.gov filetype:pdf',
                            'site:saopaulo.ussembassy.gov inurl:admin',
                            'cache:saopaulo.ussembassy.gov'
                        ]
                    },
                    dados_abertos: {
                        brasil_io: 'https://brasil.io/datasets',
                        dados_gov: 'https://dados.gov.br',
                        brasilia_api: 'https://brasilapi.com.br'
                    },
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'documentos':
                return {
                    processos_judiciais: await getDocumentData(),
                    registos_oficiais: {
                        pje: 'https://www.cnj.jus.br',
                        dou: 'https://www.in.gov.br',
                        cnj: 'https://www.cnj.jus.br'
                    },
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'fiscal':
                return {
                    transparency_data: await getFiscalData(),
                    cnpj: '54.016.822/0001-82',
                    consulado: 'Consulado-Geral dos EUA em São Paulo',
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'seguranca':
                return {
                    security_data: await getSecurityData(),
                    fire_exits: getFireExitData(),
                    fontes: ['SINESP', 'CERT.br', 'CEMADEN', 'S2iD'],
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            case 'cnpj':
                return {
                    cnpj_data: {
                        principal: '54.016.822/0001-82',
                        entidade: 'Consulado-Geral dos EUA em São Paulo',
                        status: 'Regular',
                        regime: 'Imunidade Diplomática',
                        data_abertura: '1967-01-01',
                        natureza_juridica: 'Representação Diplomática Estrangeira',
                        endereco: 'Rua Henri Durant 500, São Paulo, SP, 04709-110'
                    },
                    consultas_publicas: [
                        { fonte: 'Receita Federal', url: 'https://www.receita.federal.gov.br', tipo: 'Cadastro CNPJ' },
                        { fonte: 'JUCESP', url: 'https://www.jucesp.sp.gov.br', tipo: 'Cartório de Registro' },
                        { fonte: 'Sintegra', url: 'https://www.sintegra.gov.br', tipo: 'Inscrição Estadual' },
                        { fonte: 'Cadesp', url: 'https://www.cadesp.fazenda.sp.gov.br', tipo: 'Débitos ICMS' }
                    ],
                    socios: [
                        { nome: 'UNITED STATES DEPARTMENT OF STATE', qualificacao: 'Representante Diplomático' },
                        { nome: 'EMBASSY OF THE UNITED STATES', qualificacao: 'Missão Diplomática' }
                    ],
                    dados_abertos_gov: {
                        brasil_api: 'https://brasilapi.com.br/api/cnpj/v1/54016822000182',
                        dados_gov: 'https://dados.gov.br/dataset/cnpj-mais',
                        brasil_io: 'https://brasil.io/datasets/empresas/cnpj'
                    },
                    categorizado: true,
                    timestamp: new Date().toISOString()
                };
                
            default:
                return { 
                    error: 'Categoria desconhecida',
                    categoriasDisponiveis: ['infraestrutura', 'redes', 'web', 'documentos', 'fiscal', 'seguranca', 'cnpj']
                };
        }
    } catch (err) {
        console.error(`Erro ao minerar categoria ${category}:`, err.message);
        return {
            error: err.message,
            categoria: category,
            timestamp: new Date().toISOString()
        };
    }
};
