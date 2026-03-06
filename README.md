# Sistema OSINT - Análise Predial Consulado EUA

Sistema profissional para agentes de modernização predial da Prefeitura de São Paulo e órgãos da Polícia Civil. Realiza mineração on demand de informações OSINT legais sobre o edifício do consulado norte-americano, identificando irregularidades em registros e oportunidades de modernização radical para segurança.

## Funcionalidades

- **Interface Profissional**: UI sólida com Bootstrap, ícones e layout responsivo para uso oficial.
- **Busca On Demand**: Campos para endereço e termos SEI, com botões para análise, busca e exportação.
- **Irregularidades Identificadas**: Lista de potenciais problemas em documentação e conformidade.
- **Oportunidades de Modernização**: Sugestões focadas em segurança predial.
- **Dados Geográficos**: Integração com GEOSAMPA para riscos e edificações.
- **Scraping Legal**: Extração de conteúdo de sites oficiais.
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

## Publicação

Hospede o backend em Heroku/Vercel. Para frontend, use GitHub Pages. Adicione autenticação se necessário para acesso controlado.