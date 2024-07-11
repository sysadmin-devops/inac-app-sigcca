const express = require('express');
const router = express.Router();
const criancaController = require('../controllers/CriancaController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Rota para criar uma nova criança
router.post('/criancas', authMiddleware , upload.single('imagem'), criancaController.criarCrianca);

// Rota para buscar todas as crianças
router.get('/criancas', authMiddleware, criancaController.buscarTodasCriancas);

// Rota para buscar a quantidade de crianças por província em ordem alfabética
router.get('/criancas/quantidadePorProvinciaOrdenado', authMiddleware, criancaController.buscarQuantidadeCriancasPorProvinciaOrdenado);

// Rota para buscar uma criança por ID
router.get('/criancas/:id',authMiddleware, criancaController.buscarCriancaPorId);

// Rota para atualizar uma criança por ID
router.put('/criancas/:id',authMiddleware,  upload.single('imagem'), criancaController.atualizarCrianca);

// Rota para excluir uma criança por ID
router.delete('/criancas/:id', authMiddleware, criancaController.excluirCrianca);

// Rota para buscar crianças por centro de acolhimento
router.get('/criancas/centro/:centroId',authMiddleware,  criancaController.buscarCriancasPorCentro);

// Rota para buscar crianças por província
router.get('/criancas/provincia/:provincia',authMiddleware, criancaController.buscarCriancasPorProvincia);

// Rota para buscar crianças por município
router.get('/criancas/municipio/:municipio',authMiddleware,  criancaController.buscarCriancasPorMunicipio);

// Rota para buscar crianças por nacionalidade
router.get('/criancas/nacionalidade/:nacionalidade',authMiddleware,  criancaController.buscarCriancasPorNacionalidade);


module.exports = router;