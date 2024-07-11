const express = require('express');
const funcionarioController = require('../controllers/FuncionarioController');
const router = express.Router();
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');


// Rota para obter todos os funcionários
router.get('/funcionarios',authMiddleware, funcionarioController.getAllFuncionarios);

// Rota para obter um funcionário por ID
router.get('/funcionarios/:id', authMiddleware, funcionarioController.getFuncionarioById);

// Rota para atualizar um funcionário
router.put('/funcionarios/:id',authMiddleware, upload.single('imagem'), funcionarioController.updateFuncionario);

// Rota para excluir um funcionário
router.delete('/funcionarios/:id',authMiddleware,  funcionarioController.deleteFuncionario);
// Rota para buscar crianças adicionadas por um funcionário em um determinado centro
router.get('/funcionarios/:funcionarioId/centros/:centroId/criancas', funcionarioController.buscarCriancasPorFuncionarioEcentro);

module.exports = router;
