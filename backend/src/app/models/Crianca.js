const mongoose = require('mongoose');

// Validação de idade
const validarIdade = (dataNascimento) => {
  const hoje = new Date();
  const idade = hoje.getFullYear() - dataNascimento.getFullYear();
  return idade >= 1 && idade <= 17;
};


const criancaSchema = new mongoose.Schema({
  // Informações básicas
  nome_completo: { type: String, required: true },
  nome_desconhecido: { type: Boolean, default: false },
  sexo: { type: String, required: true },
  filiacao: { type: String },
  provincia: { type: String, required: true },
  municipio: { type: String },
  nacionalidade: { type: String, required: true },
  distrito: { type: String },
  bairro: { type: String },
  imagem: { type: String },
  imagemBase64: { type: String },
  naturalidade: { type: String },
  zona_vivia: { type: String },
  ponto_referencia: { type: String },
  data_nascimento: {
    type: Date,
    validate: [validarIdade, 'A criança deve ter entre 1 e 17 anos']
  },
  // Datas automáticas
  data_entrada: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now },

  // Características
  caracteristicas: [{
    descricao: { type: String },
    vestuario: { type: String },
  }],

  // Contacto Familiar
  contacto_familiar: {
    familia_localizada: { type: Boolean, default: false },
    residencia_atual: { type: String },
    frequencia_contacto_anual: { type: Number },
    pessoa_vivia_crianca: { type: String },
    irmaos_biologicos: { type: Boolean },
    quanto_tempo: { type: String },
    onde_esteve: { type: String },
    telefone: { type: String },
    email: { type: String }
  },

  // Escola
  escola: {
    classe: { type: String },
    escola: { type: String },
    ano: { type: Number }
  },

  // Entidade Responsável pela Criança
  entidade_responsavel_crianca: {
    nome_responsavel: { type: String },
    telefone: { type: String },
    telemovel: { type: String },
    email: { type: String }
  },

  // Antecedentes da Criança
  antecedentes_crianca: {
    acto_licito: { type: String },
    justica_juvenil: { type: Boolean },
    instituicao_justica_juvenil: { type: String }
  },

  // Motivo de Saída
  motivo_saida: {
    descricao: { type: String }
  },

  // Acompanhamento Técnico
  acompanhamento_tecnico: {
    frequencia_escolar: { type: Number },
    curso_tecnico: { type: String },
    acompanhamento_psicologico: { type: Boolean },
    comportamento_positivo: { type: Boolean },
    acompanhamento_medico: { type: Boolean },
    estado: { type: String },
    nome_tecnico: { type: String },
    telefone: { type: String },
    telemovel: { type: String },
    email: { type: String }
  },

  // Processo de Reunificação
  processo_reunificacao: {
    processo_anterior: { type: String },
    descricao_processo_anterior: { type: String }
  },
  // Referências
  funcionario: { type: mongoose.Schema.Types.ObjectId, ref: 'Funcionario' },
  adminGeral: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminGeral' },
  adminCentro: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminCentro' },
  centroAcolhimento: { type: mongoose.Schema.Types.ObjectId, ref: 'centros' }
});

// Middleware para atualizar a data_atualizacao antes de salvar
criancaSchema.pre('save', function(next) {
  this.data_atualizacao = new Date();
  next();
});

// Middleware para atualizar a data_atualizacao antes de atualizar
criancaSchema.pre('findOneAndUpdate', function(next) {
  this._update.data_atualizacao = new Date();
  next();
});

module.exports = mongoose.model('criancas', criancaSchema);