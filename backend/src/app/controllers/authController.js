const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Funcionario = require('../models/Funcionario');
const AdminCentro = require('../models/AdminCentro');
const CentroAcolhimento = require('../models/CentroAcolhimento');
const AdminGeral = require('../models/AdminGeral');
const config = require('../../config/config');
const authConfig = require('../../config/auth');
const path = require('path');
const utils = require('../../utils/utils')

const User = require('../models/user');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 172800,
  });
}

// Registro de administrador geral
async function registerAdminGeral(req, res) {
  const { email, nome, senha, role } = req.body;

  if (!email || !nome || !senha || !role) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    return res.status(400).send({ error: 'Todos os campos (email, nome, senha, role) são obrigatórios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    return res.status(400).send({ error: 'O email fornecido não é válido' });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const adminExistente = await AdminGeral.findOne({ email });
    if (adminExistente) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req);
      return res.status(400).send({ error: 'E-mail já cadastrado' });
    }

    // Cria o administrador geral
    const admin = new AdminGeral({ email, nome, senha, role });

    // Verifica se há um arquivo de imagem no corpo da requisição
    if (req.file) {
      admin.imagem = req.file.filename;
    }

    await admin.save();

    admin.senha = undefined;

    return res.send({
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        imagem: admin.imagem,
      },
      token: generateToken({ id: admin.id }),
    });
  } catch (err) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    console.error('Erro no registro de administrador geral:', err);
    return res.status(500).send({ error: 'Falha no registro de administrador geral, tente novamente mais tarde' });
  }
}

// Registro de funcionário
async function registerFuncionario(req, res) {
  const { email, nome, senha, role, centroAcolhimento } = req.body;

  if (!email || !nome || !senha || !role || !centroAcolhimento) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req)
    return res.status(400).send({ error: 'Todos os campos (email, nome, senha, role, centroAcolhimento) são obrigatórios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req)
    return res.status(400).send({ error: 'O email fornecido não é válido' });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const funcionarioExistente = await Funcionario.findOne({ email });
    if (funcionarioExistente) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req)
      return res.status(400).send({ error: 'E-mail já cadastrado' });
    }

    // Consulta o banco de dados para obter o ID do centro de acolhimento com base no nome fornecido
    const centro = await CentroAcolhimento.findOne({ nome: centroAcolhimento });
    if (!centro) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req)
      return res.status(400).send({ error: 'Centro de acolhimento não encontrado' });
    }

    // // Cria o funcionário com o ID do centro de acolhimento obtido
    const funcionario = new Funcionario({ email, nome, senha, role, centroAcolhimento: centro._id });

    // Verifica se há um arquivo de imagem no corpo da requisição
    if (req.file) {
      // return console.log(req.file); 
      funcionario.imagem = req.file.filename;
    }

    await funcionario.save();

    funcionario.senha = undefined;

    return res.send({
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
        role: funcionario.role,
        centroAcolhimento: funcionario.centroAcolhimento,
        imagem: funcionario.imagem,
      },
      token: generateToken({ id: funcionario.id }),
    });
  } catch (err) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req)
    console.error('Erro no registro de funcionário:', err);
    return res.status(500).send({ error: 'Falha no registro de funcionário, tente novamente mais tarde' });
  }
}




// Registro de administrador de centro
async function registerAdminCentro(req, res) {
  const { email, nome, senha, role, centroAcolhimento } = req.body;

  if (!email || !nome || !senha || !role || !centroAcolhimento) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    return res.status(400).send({ error: 'Todos os campos (email, nome, senha, role, centroAcolhimento) são obrigatórios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    return res.status(400).send({ error: 'O email fornecido não é válido' });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const adminExistente = await AdminCentro.findOne({ email });
    if (adminExistente) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req);
      return res.status(400).send({ error: 'E-mail já cadastrado' });
    }

    // Consulta o banco de dados para obter o ID do centro de acolhimento com base no nome fornecido
    const centro = await CentroAcolhimento.findOne({ nome: centroAcolhimento });
    if (!centro) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req);
      return res.status(400).send({ error: 'Centro de acolhimento não encontrado' });
    }

    // Cria o administrador do centro com o ID do centro de acolhimento obtido
    const admin = new AdminCentro({ email, nome, senha, role, centroAcolhimento: centro._id });

    // Verifica se há um arquivo de imagem no corpo da requisição
    if (req.file) {
      admin.imagem = req.file.filename;
    }

    await admin.save();

    admin.senha = undefined;

    return res.send({
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        centroAcolhimento: admin.centroAcolhimento,
        imagem: admin.imagem,
      },
      token: generateToken({ id: admin.id }),
    });
  } catch (err) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    console.error('Erro no registro de administrador de centro:', err);
    return res.status(500).send({ error: 'Falha no registro de administrador de centro, tente novamente mais tarde' });
  }
}



// Autenticação do usuário
async function authenticateUser(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    let user;
    let role;

    // Verifica se o usuário é um funcionário
    user = await Funcionario.findOne({ email }).select('+senha');
    if (user) {
      role = 'funcionario';
    } else {
      // Se não encontrar o usuário como funcionário, verifica se é um adminCentro
      user = await AdminCentro.findOne({ email }).select('+senha');
      if (user) {
        role = 'adminCentro';
      } else {
        // Se não encontrar o usuário como funcionário ou adminCentro, verifica se é um adminGeral
        user = await AdminGeral.findOne({ email }).select('+senha');
        if (user) {
          role = 'adminGeral';
        } else {
          return res.status(400).send({ error: 'E-mail não encontrado em nosso sistema' });
        }
      }
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).send({ error: 'Senha incorreta' });
    }

    // Remove a senha da resposta
    user.senha = undefined;

    // Retorna os dados do usuário autenticado junto com o token de acesso
    res.send({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: role,
        centroAcolhimento: user.centroAcolhimento,
      },
      token: generateToken({ id: user.id , role: user.role, centroAcolhimento: user.centroAcolhimento}),
    });
  } catch (err) {
    console.error('Erro na autenticação de usuário:', err);
    return res.status(400).send({ error: 'Falha na autenticação de usuário, tente novamente mais tarde' });
  }
}




//mail
const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'pedrodeveloper09',
    pass: 'cqgryndwpyfwisbr '
  },
});




async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: 'E-mail não encontrado em nossa base de dados' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    // Aqui você deve salvar o token no banco de dados associado ao usuário

    await transport.sendMail({
      from: 'inac-si',
      to: email,
      subject: 'Recuperação de Senha',
      html: `<p>
               Recebemos uma solicitação para recuperar a senha da sua conta.
                    <br>
               Para redefinir sua senha, clique no link abaixo:<br>

               <a href="http://localhost:3000/reset_password?token=${token}">aqui</a><br>

               Este link é válido por 24 horas. Se você não conseguir redefinir sua senha dentro desse período, solicite um novo link.<br>

               Se você não solicitou a recuperação da sua senha, ignore este e-mail. Se você acredita que sua conta foi comprometida, altere sua senha imediatamente após redefini-la.</p>`,
    });

    return res.status(200).json({ message: 'E-mail de recuperação de senha enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação de senha:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function magicLink(req, res) {
  const { token } = req.query;

  try {
    const user = await User.findOne({ passwordResetToken: token });

    if (!user || user.passwordResetExpires < Date.now()) {
      return res.status(400).send({ error: 'Token inválido ou expirado' });
    }

    // Redirecionar o usuário para a página de redefinição de senha no frontend
    return res.redirect(`http://seufrontend.com/reset-password?token=${token}`);
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao verificar o token de Magic Link' });
  }
}




module.exports = {
  registerFuncionario,
  registerAdminGeral,
  //authenticateFuncionario,
  registerAdminCentro,
  authenticateUser,
  // authenticateAdminCentro,
  forgotPassword,
};


