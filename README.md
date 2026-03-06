# Background Check Pro - Sistema Profissional de Verificação

Sistema avançado de background check para verificação profunda de pessoas e empresas. Utiliza técnicas OSINT avançadas com integração a múltiplas APIs (Google, Facebook, Escavador) para análise completa de antecedentes, dados financeiros, redes sociais e documentos legais.

## Funcionalidades

### 🔍 **Verificação Profunda**
- **Análise de Pessoas**: Verificação completa de antecedentes, dados cadastrais, redes sociais
- **Análise de Empresas**: CNPJ, sócios, documentos legais, situação financeira
- **Geração de CPF**: Algoritmo avançado para geração de CPFs válidos a partir de nomes
- **Validação de Documentos**: CPF, CNPJ, telefones, e-mails com verificação em tempo real

### 🌐 **Integração APIs**
- **Google Custom Search**: Busca profunda na web e redes sociais
- **Facebook Graph API**: Dados de perfis e páginas sociais
- **Escavador API**: Documentos legais e processos judiciais
- **Sistema de Fallback**: Robustez garantida mesmo sem APIs configuradas

### 🎯 **Interface Terminal-Style**
- **Design Neobrutalista**: Terminal hacker com cores verde/preto
- **Avaliação de Risco**: Medidor visual com alertas inteligentes
- **Linha do Tempo**: Histórico completo de verificações e eventos
- **Cards Detalhados**: Informações organizadas por categoria

### 📊 **Análise Inteligente**
- **Score de Risco**: Algoritmo proprietário para cálculo de risco
- **Alertas Automáticos**: Classificação por nível de perigo
- **Validação Cruzada**: Verificação em múltiplas fontes
- **Relatórios Abrangentes**: Exportação em múltiplos formatos

## Acesso Autorizado

Exclusivo para delegados e agentes autorizados. Todas as operações são baseadas em fontes abertas e legais, promovendo transparência democrática.

## Como Usar

1. Execute o servidor: `npm start`
2. Acesse `http://localhost:3000`
3. Selecione o tipo de verificação (Pessoa, Empresa, CPF/CNPJ, Telefone, E-mail)
4. Digite os dados para verificação profunda
5. Escolha o nível de profundidade (Básico, Padrão, Profundo, Abrangente)
6. Clique em "VERIFICAR" para análise completa
7. Analise o score de risco e alertas gerados
8. Exporte relatórios para documentação

## Tecnologias

- **Backend**: Node.js / Express
- **Frontend**: Bootstrap 5, Font Awesome, JetBrains Mono
- **APIs**: Google Custom Search, Facebook Graph, Escavador
- **Estilo**: Neobrutalista Terminal-Style
- **Validação**: Algoritmos próprios para CPF/CNPJ
- **OSINT**: Técnicas avançadas de inteligência de fonte aberta

## GitHub Pages Deployment

O sistema está configurado para deploy automático no GitHub Pages via Actions. Acesse:
- **GitHub Pages**: https://quakeweb-repo.github.io/projeto-anti-consulado/
- **Live Demo**: https://jubilant-barnacle-v6jq4xvxgjq62qxx-3000.app.github.dev

### Configuração do Deploy
- **Workflow**: `.github/workflows/deploy.yml` automatiza o deploy da branch `main` para GitHub Pages
- **Build Process**: Cria estrutura otimizada para GitHub Pages com arquivos estáticos
- **Compatibilidade**: Versão compatível com GitHub Pages (sem backend, com dados simulados)
- **404 Handling**: Página 404 customizada para SPA routing

### Funcionalidades no GitHub Pages
- ✅ Interface completa com terminal-style neobrutalista
- ✅ Simulação de mineração em tempo real
- ✅ Validação de CPF e Instagram usernames
- ✅ Progress bars e animações
- ✅ Export de resultados (JSON)
- ✅ Cards detalhados com mock data
- ✅ Sistema de avaliação de risco
- ✅ Timeline de eventos

### Limitações (GitHub Pages)
- 🚫 Sem backend real (usa dados simulados)
- 🚫 Sem WebSocket (usa polling)
- 🚫 Sem API calls externas (usa mock data)
- 🚫 Sem processamento real de dados

Para funcionalidade completa, execute localmente com `npm start`.

## Publicação

Hospede o backend em Heroku/Vercel. Para frontend, use GitHub Pages. Adicione autenticação se necessário para acesso controlado.