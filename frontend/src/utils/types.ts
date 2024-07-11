export interface UserTypes {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  centroAcolhimento: string;
  role: 'funcionario' | 'adminCentro' | 'adminGeral';
  imagem?: string;
}

export interface CriancaTypes {
  nome_completo: string;
  imagem: string;
  imagemBase64: string;
  data_nascimento: string;
  nacionalidade: string;
  sexo: string;
  filiacao: string;
  naturalidade: string;
  provincia: string;
  municipio: string;
  estado: string;
  distrito: string;
  zona_vivia: string;
  data_entrada: string;
  ponto_referencia: string;
  caracteristicas: {
    length: number;
    descricao: string;
    vestuario: string;
  };
  contacto_familiar: {
    familia_localizada: boolean;
    residencia_atual: string;
    frequencia_contacto_anual: number;
    pessoa_vivia_crianca: string;
    irmaos_biologicos: boolean;
    quanto_tempo: string;
    onde_esteve: string;
    telefone: number;
    email: string;
  };
  escola: {
    escola: string;
    classe: string;
    ano: string;
  };
  entidade_responsavel_crianca: {
    nome_responsavel: string;
    telefone: number;
    telemovel: number;
    email: string;
  };
  antecedentes_crianca: {
    acto_licito: string;
    justica_juvenil: boolean;
    instituicao_justica_juvenil: string;
  };
  motivo_saida: {
    descricao: string;
  };
  acompanhamento_tecnico: {
    frequencia_escolar: string;
    curso_tecnico: string;
    acompanhamento_psicologico: boolean;
    comportamento_positivo: boolean;
    acompanhamento_medico: boolean;
    estado: string;
    nome_tecnico: string;
    telefone: number;
    telemovel: number;
    email: string;
  }
  processo_reunificacao: {
    processo_anterior: string;
    descricao_processo_anterior: string;
  }
}