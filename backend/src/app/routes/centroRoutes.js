const express = require('express');
const router = express.Router();
const centroAcolhimentoController = require('../controllers/CentroAcolhimentoController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para registrar um novo Centro de Acolhimento
router.post('/centroAcolhimento/register',authMiddleware , upload.single('imagem'), centroAcolhimentoController.registerCentroAcolhimento);

// Rota para obter todos os Centros de Acolhimento
router.get('/centroAcolhimento', authMiddleware , centroAcolhimentoController.getAllCentros);

// Rota para obter um Centro de Acolhimento por ID
router.get('/centroAcolhimento/:id', authMiddleware , centroAcolhimentoController.getCentroById);

// Rota para atualizar um Centro de Acolhimento por ID
router.put('/centroAcolhimento/:id',authMiddleware ,  upload.single('imagem'),centroAcolhimentoController.updateCentro);

// Rota para excluir um Centro de Acolhimento por ID
router.delete('/centroAcolhimento/:id',authMiddleware , centroAcolhimentoController.deleteCentro);

module.exports = router;
