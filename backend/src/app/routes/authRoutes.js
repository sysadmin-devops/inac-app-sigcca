const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload');

// Rota para registro de funcionários com upload de imagem
router.post('/registerFuncionario', upload.single('imagem'), authController.registerFuncionario);

// router.post('/authenticateFuncionario', authController.authenticateFuncionario);

// Rotas para registro e autenticação de administradores de centro
router.post('/registerAdminCentro', upload.single('imagem'), authController.registerAdminCentro);

// Rota para registro de AdminGeral
router.post('/registerAdminGeral', upload.single('imagem'),authController.registerAdminGeral);


// Rota para autenticação de usuários (funcionários e administradores do centro)
router.post('/authenticateUser', authController.authenticateUser);
// Rota para solicitar redefinição de senha
router.post('/forgot_password', authController.forgotPassword);

module.exports = router;
