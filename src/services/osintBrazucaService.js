// Serviço agregador simulando várias fontes do projeto OSINT Brazuca
// Para cada categoria retornamos subobjetos por fonte (Twitter, Google, GeoSampa, etc.)

import {
    getGeosampaData,
    getGeosampaDataLive,
    getPhotoCollection,
    getPhotoCollectionLive,
    getSocialMediaData,
    getSocialMediaDataLive,
    getGoogleData,
    getGoogleDataLive,
    getFireExitData
} from './miningService.js';

export const getOsintCategory = async (category) => {
    // categories: infraestrutura, redes, web, documentos, fiscal, seguranca
    switch (category) {
        case 'infraestrutura':
            return {
                geoSampa: await getGeosampaDataLive(),
                prefeitura: {
                    cadastro: 'Imóvel 8.750m², sem licenças registradas',
                    zoneamento: '03-25 uso misto'
                }
            };
        case 'redes':
            return {
                twitter: { handle: '@USEmbassySaoPa', tweets: 6240 },
                facebook: { page: 'USEmbassyBrazil', likes: 12345 }
            };
        case 'web':
            return {
                google: await getGoogleDataLive(),
                youtube: { channel: 'USEmbBrazil', subscribers: '4k' }
            };
        case 'documentos':
            return {
                sei: ['PLANTA-2019.pdf', 'REL-ESTR-2021.pdf'],
                avcb: 'Não localizado',
                iptu: 'Isento (imunidade diplomática)'
            };
        case 'fiscal':
            return {
                cnpj: '54.016.822/0001-82',
                situacao: 'Regular',
                regime: 'Imunidade diplomática',
                iptu: 'Isento'
            };
        case 'seguranca':
            return {
                fireExits: getFireExitData(),
                riscosGeo: (await getGeosampaDataLive()).riscos
            };
        default:
            return { error: 'Categoria desconhecida' };
    }
};
