const jwt = require('jsonwebtoken');
const Funcionario = require('../models/Funcionario');
const AdminCentro = require('../models/AdminCentro');
const AdminGeral = require('../models/AdminGeral');

async function authMiddleware(req, res, next) {
   // Verifica se o cabeçalho de autorização existe
   if (!req.headers ||!req.headers.authorization) {
    return res.status(401).send('Unauthorized');
  }
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'f3a855bc7e3ae048578725c915b45987');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.centroAcolhimento = decoded.centroAcolhimento;

    

    if (req.userRole!== 'funcionario' && req.userRole!== 'adminCentro' && req.userRole!== 'adminGeral') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Log antes da verificação dos papéis permitidos
    console.log("User Role after assignment:", req.userRole);

    if (req.userRole === 'funcionario') {
      const funcionario = await Funcionario.findById(req.userId);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      req.funcionario = funcionario;
    } else if (req.userRole === 'adminCentro') {
      const adminCentro = await AdminCentro.findById(req.userId);
      if (!adminCentro) {
        return res.status(404).json({ error: 'AdminCentro não encontrado' });
      }
      req.adminCentro = adminCentro;
    } else if (req.userRole === 'adminGeral') {
      const adminGeral = await AdminGeral.findById(req.userId);
      if (!adminGeral) {
        return res.status(404).json({ error: 'AdminGeral não encontrado' });
      }
      req.adminGeral = adminGeral;
    }

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ error: 'Autenticação falhou' });
  }
}

module.exports = authMiddleware;
