# Sistema OSINT - Análise Predial Consulado EUA

Sistema profissional para agentes de modernização predial da Prefeitura de São Paulo e órgãos da Polícia Civil. Realiza mineração on demand de informações OSINT legais sobre o edifício do consulado norte-americano, identificando irregularidades em registros e oportunidades de modernização radical para segurança.

## Funcionalidades

- **Interface Profissional**: UI sólida com Bootstrap, ícones e layout responsivo para uso oficial.
- **Busca On Demand**: Campos para endereço e termos SEI, com botões para análise, busca e exportação.
- **Irregularidades Identificadas**: Lista de potenciais problemas em documentação e conformidade.
- **Oportunidades de Modernização**: Sugestões focadas em segurança predial.
- **Dados Geográficos**: Integração com GEOSAMPA para riscos e edificações.
- **Scraping Legal**: Extração de conteúdo de sites oficiais.
- **Mineração On-Demand**: A interface usa sete caixas principais que agrupam um conjunto de webservices/OSINT Brazuca:
  1. **Infraestrutura** – GeoSampa, Prefeitura, cadastro imobiliário;
  2. **Redes Sociais** – Twitter, Facebook, Instagram (coletados pelo OSINT Brazuca);
  3. **Busca Web** – Google, YouTube, notícias;
  4. **Documentos** – SEI, AVCB, licenças;
  5. **Fiscal/Tributos** – CNPJ, IPTU, regime diplomático;
  6. **Segurança** – saídas de incêndio, riscos geológicos;
  7. **CNPJ/CPF** – Dados cadastrais do consulado (padrão: 54.016.822/0001-82).

  Cada caixa dispara `fetch('/api/osint/<categoria>?live=1')` para o servidor hospedado na codespace. O backend agrega diversas fontes (Twitter, Google, GeoSampa, Prefeitura) e devolve os dados agrupados por origem.
- **Exportação de Relatórios**: Geração de JSON para registros oficiais.

## Acesso Autorizado

Exclusivo para delegados e agentes autorizados. Todas as operações são baseadas em fontes abertas e legais, promovendo transparência democrática.

## Como Usar

1. Execute o servidor: `npm start`
2. Acesse `http://localhost:3000`
3. Insira endereço e termos, clique em "Analisar"
4. Use "Buscar SEI" para processos relacionados
5. Exporte relatórios para documentação

## Tecnologias

- Backend: Node.js / Express
- Frontend: Bootstrap 5, Font Awesome
- APIs: GEOSAMPA, Nominatim, Scraping com Cheerio

## GitHub Pages Deployment

O sistema está configurado para deploy automático no GitHub Pages via Actions. Acesse:
- **Live Demo**: https://jubilant-barnacle-v6jq4xvxgjq62qxx-3000.app.github.dev
- **GitHub Pages**: https://quakeweb-repo.github.io/projeto-anti-consulado/

O workflow `.github/workflows/deploy.yml` automatiza o deploy da branch `main` para `gh-pages`.

## Publicação

Hospede o backend em Heroku/Vercel. Para frontend, use GitHub Pages. Adicione autenticação se necessário para acesso controlado.