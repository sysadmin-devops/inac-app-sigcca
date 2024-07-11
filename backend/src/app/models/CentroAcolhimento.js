const mongoose = require('mongoose');

const centroAcolhimentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  endereco: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  capacidade: {
    type: Number,
    required: true
  },
  modalidadeAcolhimento: {
    type: String,
    required: true
  },
  recursosHumanos: {
    equipe: {
      assistentesSociais: {
        type: Number,
        required: true
      },
      psicologos: {
        type: Number,
        required: true
      },
      educadores: {
        type: Number,
        required: true
      },
      enfermeiros: {
        type: Number,
        required: true
      },
      outros: String
    },
    descricao: String
  },
  infraestrutura: {
    quartos: {
      type: Number,
      required: true
    },
    areasConvivencia: {
      type: Number,
      required: true
    },
    refeitorio: {
      type: Boolean,
      required: true
    },
    outrosEspacos: String,
    descricao: String
  },
  descricao: {
    type: String
  },
  imagem: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('centros', centroAcolhimentoSchema);
