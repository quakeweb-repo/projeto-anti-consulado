// Sistema OSINT - Dossiê Consulado Americano em São Paulo
// Interface focada SOMENTE nas 6 caixas com links diretos ao OSINT BRAZUCA

document.addEventListener('DOMContentLoaded', function() {
    // Interface já carregada com as 6 caixas principais
});

// Dossiê data estruturado pelas categorias OSINT BRAZUCA
const dossiePorCategoria = {
    infraestrutura: {
        titulo: 'Infraestrutura - Telecom, Energia, Transportes',
        icone: 'fa-building',
        repositorios: [
            {
                titulo: 'ANATEL - Consulta de Outorgas de Radiodifusão',
                link: 'https://sistemas.anatel.gov.br/easp/Novo/ConsultaIndicativo/Tela.asp',
                descricao: 'Consulta de outorgas de serviços de radiodifusão'
            },
            {
                titulo: 'ANATEL - Sistema de Serviços de Telecomunicações (STEL)',
                link: 'https://sistemas.anatel.gov.br/stel/',
                descricao: 'Consulta de frequências, entidades e serviços de telecomunicações'
            },
            {
                titulo: 'ANATEL - Infraestrutura de Telecomunicações',
                link: 'https://www.anatel.gov.br/paineis/infraestrutura',
                descricao: 'Painéis de dados sobre infraestrutura de telecomunicações'
            },
            {
                titulo: 'ANEEL - Sistema de Informações de Geração',
                link: 'https://www.aneel.gov.br/siga',
                descricao: 'Consulta de usinas, distribuidoras e empreendimentos de geração'
            },
            {
                titulo: 'ANEEL - Consulta de Usinas e Geradoras',
                link: 'https://www2.aneel.gov.br/aplicacoes/capacidadebrasil/capacidadebrasil.cfm',
                descricao: 'Banco de dados de empreendimentos de geração de energia'
            },
            {
                titulo: 'DNIT - Departamento Nacional de Infraestrutura de Transportes',
                link: 'https://servicos.dnit.gov.br/dadosabertos/',
                descricao: 'Dados abertos de infraestrutura de transportes'
            },
            {
                titulo: 'ANTT - Agência Nacional de Transportes Terrestres',
                link: 'https://dados.antt.gov.br/dataset',
                descricao: 'Dados abertos de transportes rodoviários'
            }
        ]
    },
    redes: {
        titulo: 'Redes - Social Media e Mensagens Instantâneas',
        icone: 'fa-share-alt',
        repositorios: [
            {
                titulo: 'LinkedIn - Busca Profissional',
                link: 'https://www.linkedin.com/jobs/search/?keywords=&location=Brasil',
                descricao: 'Rede de negócios com 750M+ usuários'
            },
            {
                titulo: 'Instagram - Exploração de Conteúdo',
                link: 'https://www.instagram.com/explore/',
                descricao: 'Ferramenta de busca de imagens por localidade'
            },
            {
                titulo: 'Twitter - Busca Avançada',
                link: 'https://twitter.com/search-advanced',
                descricao: 'Busca avançada com filtros por idioma e localização'
            },
            {
                titulo: 'Facebook - Biblioteca de Anúncios',
                link: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR',
                descricao: 'Transparência publicitária com coleção pesquisável'
            },
            {
                titulo: 'TikTok - Exploração de Vídeos',
                link: 'https://www.tiktok.com/explore',
                descricao: 'Plataforma de vídeos curtos com crescimento exponencial'
            },
            {
                titulo: 'YouTube - Busca e Análise',
                link: 'https://www.youtube.com/',
                descricao: 'Plataforma de vídeos com conteúdo georreferenciado'
            },
            {
                titulo: 'Telegram - Indexação de Grupos',
                link: 'https://duckduckgo.com/?q=site%3At.me+brasil',
                descricao: 'Busca de grupos e canais públicos com conteúdo Brasil'
            }
        ]
    },
    web: {
        titulo: 'Web - Motores de Busca e Dados Abertos',
        icone: 'fa-globe',
        repositorios: [
            {
                titulo: 'Google Hacking - OSINT Brasil',
                link: 'https://www.google.com/search?q=site%3Acom.br+inurl%3Aadmin',
                descricao: 'Google Hacking para dados expostos no Brasil com dorks avançadas'
            },
            {
                titulo: 'Shodan - Busca de Servidores',
                link: 'https://www.shodan.io/search?query=country%3A%22BR%22',
                descricao: 'Mecanismo de pesquisa para dispositivos conectados à internet'
            },
            {
                titulo: 'VirusTotal - Análise de URLs',
                link: 'https://www.virustotal.com/',
                descricao: 'Scanner de URLs com análise de reputação e detecção de malware'
            },
            {
                titulo: 'URLScan.io - Scanner Visual',
                link: 'https://urlscan.io/',
                descricao: 'Scanner com análise visual de URLs e domínios'
            },
            {
                titulo: 'dados.gov.br - Portal Federal',
                link: 'https://dados.gov.br/home',
                descricao: 'Catálogo central com 10mil+ conjuntos de dados do governo federal'
            },
            {
                titulo: 'Brasil.io - Dados Públicos',
                link: 'https://brasil.io/datasets/',
                descricao: 'Repositório de dados públicos em formato acessível e padronizado'
            },
            {
                titulo: 'BrasilAPI - APIs Públicas',
                link: 'https://brasilapi.com.br/',
                descricao: 'APIs públicas gratuitas com informações brasileiras'
            }
        ]
    },
    documentos: {
        titulo: 'Documentos - Processos, Diários e Registros',
        icone: 'fa-file-contract',
        repositorios: [
            {
                titulo: 'Portal PJe - Processo Judicial Eletrônico',
                link: 'https://www.cnj.jus.br/programas-e-acoes/numeracao-unica/',
                descricao: 'Sistema unificado de consulta processual em todos os tribunais'
            },
            {
                titulo: 'CNJ - Consulta Processual Pública',
                link: 'https://www.cnj.jus.br/consulta-processual-publica/',
                descricao: 'Consulta centralizada em todos os tribunais do Brasil'
            },
            {
                titulo: 'STF - Superior Tribunal Federal',
                link: 'https://jurisprudencia.stf.jus.br/',
                descricao: 'Consulta de jurisprudência e acórdãos do STF'
            },
            {
                titulo: 'STJ - Superior Tribunal de Justiça',
                link: 'https://www.stj.jus.br/',
                descricao: 'Sistema de consultas processuais do STJ'
            },
            {
                titulo: 'BNMP - Banco Nacional de Mandados',
                link: 'https://portalbnmp.cnj.jus.br',
                descricao: 'Sistema de mandados de prisão facilitando consultas públicas'
            },
            {
                titulo: 'Diário Oficial da União',
                link: 'https://www.in.gov.br/',
                descricao: 'Publicações oficiais do Governo Federal com todos os atos'
            },
            {
                titulo: 'JusBrasil - Base de Jurisprudência',
                link: 'https://www.jusbrasil.com.br/',
                descricao: 'Startup que reúne dados judiciais de todo o Brasil'
            }
        ]
    },
    fiscal: {
        titulo: 'Fiscal - CNPJ, Tributos, Sanções e Transparência',
        icone: 'fa-receipt',
        repositorios: [
            {
                titulo: 'Consulta Situação CPF',
                link: 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp',
                descricao: 'Consulta pública de CPF pela Receita Federal do Brasil'
            },
            {
                titulo: 'Consulta de Dados CNPJ',
                link: 'https://www.redecnpj.com.br/rede/',
                descricao: 'Visualização de dados públicos de CNPJ com relacionamentos'
            },
            {
                titulo: 'Portal da Transparência',
                link: 'https://portaldatransparencia.gov.br/',
                descricao: 'Consultas a favorecidos, convênios, servidores e sanções'
            },
            {
                titulo: 'CEIS - Empresas Inidôneas',
                link: 'http://www.portaltransparencia.gov.br/sancoes/ceis',
                descricao: 'Empresas impedidas de participar de licitações públicas'
            },
            {
                titulo: 'CNEP - Empresas Punidas',
                link: 'http://www.portaltransparencia.gov.br/sancoes/cnep',
                descricao: 'Empresas punidas com base na Lei Anticorrupção'
            },
            {
                titulo: 'CadBE - Beneficiários Efetivos',
                link: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cadastro-de-beneficiarios-efetivos-cadbe',
                descricao: 'Cadastro público de beneficiários finais de pessoas jurídicas'
            },
            {
                titulo: 'Portal TCU - Dados Abertos',
                link: 'https://portal.tcu.gov.br/dados-abertos/',
                descricao: 'Dados abertos do Tribunal de Contas da União'
            }
        ]
    },
    seguranca: {
        titulo: 'Segurança - Crimes, Cibernética e Defesa Civil',
        icone: 'fa-shield-alt',
        repositorios: [
            {
                titulo: 'Programa Captura - MJSP',
                link: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/operacoes-integradas/projeto-captura',
                descricao: 'Lista nacional de criminosos mais procurados organizada por estado'
            },
            {
                titulo: 'SINESP Cidadão',
                link: 'https://www.gov.br/pt-br/servicos/consultar-os-criminosos-mais-procurados-do-brasil',
                descricao: 'Consulta oficial de procurados pela Justiça no Brasil'
            },
            {
                titulo: 'INTERPOL - Fugitivos',
                link: 'https://www.interpol.int/Contacts/Fugitives-wanted-persons',
                descricao: 'Lista pública de fugitivos procurados internacionalmente'
            },
            {
                titulo: 'Desaparecidos SP',
                link: 'https://www.ssp.sp.gov.br/servicos/desaparecidos',
                descricao: 'Banco de dados de desaparecidos em São Paulo'
            },
            {
                titulo: 'CERT.br - Segurança Cibernética',
                link: 'https://www.cert.br/',
                descricao: 'Centro de incidentes, alertas de vulnerabilidades e estatísticas'
            },
            {
                titulo: 'CEMADEN - Monitoramento de Desastres',
                link: 'https://www.cemaden.gov.br/',
                descricao: 'Monitoramento de risco de desastres naturais em tempo real'
            },
            {
                titulo: 'S2iD - Sistema de Desastres',
                link: 'https://s2id.mi.gov.br/',
                descricao: 'Registro e consulta de desastres e emergências no Brasil'
            }
        ]
    }
};

function showDossie(categoria) {
    const dossie = dossiePorCategoria[categoria];
    if (!dossie) return;
    
    const container = document.getElementById('dossie-container');
    let html = `
        <div class="section-card">
            <div class="section-header" style="background: linear-gradient(135deg, #1e3c72 0%, #005b96 100%);">
                <i class="fas ${dossie.icone}"></i> ${dossie.titulo}
                <button onclick="hideDossie()" style="float: right; border: none; background: transparent; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
            </div>
            <div class="p-4">
                <div style="margin-bottom: 20px;">
                    <h5 style="color: #1e3c72; margin-bottom: 15px;">📋 Repositórios Primários OSINT BRAZUCA</h5>
                    <div style="margin-top: 15px;">
    `;
    
    dossie.repositorios.forEach((repo, index) => {
        html += `
            <div style="margin-bottom: 15px; padding: 15px; border-left: 5px solid #1e3c72; background-color: #f8f9fa; border-radius: 4px;">
                <div style="margin-bottom: 8px;">
                    <strong style="color: #1e3c72; font-size: 15px;">${index + 1}. ${repo.titulo}</strong>
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">${repo.descricao}</div>
                <a href="${repo.link}" target="_blank" style="color: #007bff; text-decoration: none; font-size: 12px; font-weight: 500;">
                    <i class="fas fa-external-link-alt"></i> Acessar Repositório
                </a>
            </div>
        `;
    });
    
    html += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.style.display = 'block';
    window.scrollTo(0, 0);
}

function hideDossie() {
    document.getElementById('dossie-container').style.display = 'none';
}
