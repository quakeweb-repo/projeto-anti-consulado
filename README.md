# Webservice Minerador OSINT - Análise do Edifício do Consulado Norte-Americano em São Paulo

Este é um webservice minerador on demand que realiza buscas automáticas de informações OSINT (Open Source Intelligence) sobre o edifício do consulado norte-americano localizado na Rua Henri Dunant 500, São Paulo, SP, 04709-110. O foco é identificar irregularidades na documentação de registros relacionados, de forma 100% legal, e extrair informações para acesso democrático por modernizadores prediais.

## Funcionalidades

- **Mineração On Demand**: Endpoints para buscar dados geográficos, processos SEI, scraping de sites oficiais e análise de irregularidades.
- **Integração com GEOSAMPA**: Acesso a dados abertos da prefeitura de São Paulo sobre edificações, riscos geológicos e infraestrutura.
- **Geocodificação**: Obtenção de coordenadas via Nominatim (OpenStreetMap).
- **Scraping Legal**: Extração de texto de sites públicos relacionados ao consulado.
- **Análise de Irregularidades**: Identificação de potenciais problemas em registros, licenças e conformidade urbana.
- **Oportunidades de Modernização**: Sugestões radicais para melhoria da segurança predial baseada em dados OSINT.

## Como Usar

1. Instale as dependências: `npm install`
2. Execute o servidor: `npm start`
3. Acesse `http://localhost:3000` para a interface web.
4. Use os botões para mineração on demand.

## Endpoints da API

- `GET /api/geosampa/:query` - Buscar dados no GEOSAMPA (ex: `Título=Edificação`)
- `GET /api/geocode/:address` - Geocodificar endereço
- `GET /api/scrape/:site` - Scraping de sites (consulate, visas, embassy-brasilia, consulate-sp)
- `GET /api/sei/search/:term` - Buscar processos SEI relacionados
- `GET /api/analyze/:address` - Análise completa de irregularidades e oportunidades

## Tecnologias

- Node.js / Express
- Axios para requisições HTTP
- Cheerio para scraping
- HTML/CSS/JavaScript para frontend

## Publicação

Para publicar, hospede o backend em um serviço como Heroku, Vercel ou Railway. Para o frontend, use GitHub Pages ou similar. Atualize as URLs no script.js conforme necessário.

## Aviso Legal

Todas as buscas são realizadas usando fontes públicas e abertas (OSINT), sem violação de privacidade ou leis. O objetivo é promover transparência e modernização democrática.