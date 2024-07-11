// models/AdminCentro.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminCentroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
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
  centroAcolhimento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'centros',
    required: true
  },
  role: {
    type: String,
    enum: ['funcionario', 'adminCentro'],
    default: 'adminCentro'
  },
  imagem: {
    type: String
  }
});

// Middleware do Mongoose que executa antes de salvar um documento
adminCentroSchema.pre('save', async function(next) {
  const admin = this;

  // Verifica se a senha foi modificada ou se é um novo administrador do centro
  if (!admin.isModified('senha')) return next();

  try {
    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(admin.senha, 10);

    // Substitui a senha não hash pela senha hash
    admin.senha = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('AdminCentro', adminCentroSchema);
