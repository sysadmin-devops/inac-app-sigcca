const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CentroAcolhimento =  require('../models/CentroAcolhimento');

const funcionarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  centroAcolhimento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'centros',
    required: true
  },
  role: {
    type: String,
    enum: ['funcionario', 'adminCentro'],
    default: 'funcionario'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true,
    select: false  // Importante para garantir que a senha não seja retornada nas consultas padrão
  },
  imagem: {
    type: String
  }
});

// Middleware do Mongoose que executa antes de salvar um documento
funcionarioSchema.pre('save', async function(next) {
  const funcionario = this;

  // Verifica se a senha foi modificada ou se é um novo funcionário
  if (!funcionario.isModified('senha')) return next();

  try {
    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(funcionario.senha, 10);

    // Substitui a senha não hash pela senha hash
    funcionario.senha = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('funcionarios', funcionarioSchema);
