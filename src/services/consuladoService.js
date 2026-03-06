// Serviço simples que retorna informações simuladas sobre o consulado
// incluindo documentos de estado físico e lista de membros-chefe.

export const getPhysicalDocuments = () => {
  // lista de documentos relacionados ao imóvel e à estrutura física
  return [
    {
      id: 'DOC-PLANTA-2019',
      titulo: 'Planta Arquitetônica de Reforma 2019',
      ano: 2019,
      descricao: `Projeto de reforma arquitetônica submetido à PMSP, incluindo
       reforço de fundação e ampliação de perímetro de segurança.`,
      fonte: 'SEI/PMSP',
      link: 'https://sei.prefeitura.sp.gov.br/.../PLANTA-2019.pdf'
    },
    {
      id: 'DOC-REL-ESTR-2021',
      titulo: 'Relatório de Inspeção Estrutural 2021',
      ano: 2021,
      descricao: `Laudo técnico assinado por engenheiro civil atestando
       condições das vigas e pilares do subsolo.`,
      fonte: 'Corpo de Bombeiros PMSP',
      link: 'https://bombeiros.prefeitura.sp.gov.br/.../REL-ESTR-2021.pdf'
    }
  ];
};

export const getChiefMembers = () => {
  // nomes e cargos baseados em página oficial (imagem fornecida pelo usuário)
  return [
    { cargo: 'Cônsul-Geral', nome: 'Kevin Murakami' },
    { cargo: 'Cônsul-Geral Adjunto', nome: 'Benjamin Wohlauer' },
    { cargo: 'Chefe da Seção Consular', nome: 'James Fellows' },
    { cargo: 'Chefe da Administração', nome: 'Ethan Curbow' },
    { cargo: 'Chefe da Seção Econ/Pol', nome: 'Joshua Stern' },
    { cargo: 'Chefe da Seção de Imprensa, Educação e Cultura', nome: 'Farah Chery-Medor' },
    { cargo: 'Chefe da Seção de Imprensa', nome: 'Mery Arcila' },
    { cargo: 'Chefe da Seção Cultural', nome: 'RaeJean Stokes' },
    { cargo: 'Chefe interino da Seção Comercial', nome: 'Dean Matlack' },
    { cargo: 'Chefe da Seção de Agricultura', nome: 'Amy Caldwell' }
  ];
};
