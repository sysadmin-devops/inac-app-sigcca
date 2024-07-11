//primeiro

// Autenticação de usuário com Magic Link
router.get('/magic_link', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });

        if (!user)
            return res.status(400).send({ error: 'Token inválido ou expirado' });

        // Aqui você pode gerar um token JWT para autenticar o usuário, se desejar
        const authToken = generateToken({ id: user.id });

        return res.status(200).send({ status: 'Login com Magic Link bem-sucedido', token: authToken, user });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Falha ao verificar o token de Magic Link' });
    }
});

// Enviar Magic Link por e-mail
async function sendMagicLink(email, token) {
    // Construa o link mágico, que inclui o token
    const magicLink = `http://seusite.com/auth/magic_link?token=${token}`;

    // Envie o e-mail com o link mágico
    await mailer.sendMail({
        to: email,
        subject: 'Login com Magic Link',
        from: 'seuemail@dominio.com',
        html: `Olá,<br><br>Para fazer login, clique no link a seguir:<br><br><a href="${magicLink}">${magicLink}</a>`,
    });
}

// Solicitação de redefinição de senha usando Magic Link
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'Usuário não encontrado em nossa base de dados' });

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        }, { new: true, useFindAndModify: false });

        // Envie o link mágico por e-mail
        await sendMagicLink(email, token);

        return res.status(200).send({ status: 'E-mail enviado com sucesso' });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Falha no sistema de recuperação de senha, tente novamente mais tarde' });
    }
});


//segundo
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const authConfig = require('../../config/auth');
const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 172800,
    });
}

// Registro de usuário
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Usuário já registrado em nosso sistema' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro' });
    }
});

// Autenticação de usuário
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'Usuário não encontrado em nosso sistema' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'A senha digitada não confere com o usuário' });

    user.password = undefined;

    res.send({
        user,
        token: generateToken({ id: user.id }),
    });
});


module.exports = app => app.use('/auth', router);



//terceiro

const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const routerDEPOISTIRA = express.Router();
const User = require('../models/user'); // Importe o modelo do usuário

// Configuração do transporte de e-mail (usando o Mailtrap)
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4047b3cea7a590",
    pass: "b43a5be8083d8c"
  }
});

// Rota para solicitação de recuperação de senha
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    // Encontra o usuário no banco de dados pelo e-mail fornecido
    const user = await User.findOne({ email });

    // Verifica se o usuário existe
    if (!user) {
      return res.status(400).send({ error: 'E-mail não encontrado em nossa base de dados' });
    }

    // Gera um token único para recuperação de senha
    const token = crypto.randomBytes(20).toString('hex');

    // Salva o token no banco de dados associado ao usuário (você precisa implementar esta parte)

    // Envia o e-mail de recuperação de senha
    await transport.sendMail({
      from: 'seuemail@example.com',
      to: email,
      subject: 'Recuperação de Senha',
      html: `<p>Você solicitou a recuperação de senha. Clique <a href="http://localhost:3000/reset_password?token=${token}">aqui</a> para redefinir sua senha.</p>`
    });

    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: 'E-mail de recuperação de senha enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação de senha:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
