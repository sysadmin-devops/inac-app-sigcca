const express = require('express');
const adminCentroController = require('../controllers/AdminCentro');
const router = express.Router();
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');


// Rota para obter todos os administradores de centro
router.get('/adminCentro',authMiddleware, adminCentroController.getAllAdminCentros);

// Rota para obter um administrador de centro por ID
router.get('/adminCentro/:id',authMiddleware, upload.single('imagem'), adminCentroController.getAdminCentroById);

// Rota para atualizar um administrador de centro
router.put('/adminCentro/:id',authMiddleware,upload.single('imagem'), adminCentroController.updateAdminCentro);

// Rota para deletar um administrador de centro
router.delete('/adminCentro/:id',authMiddleware, adminCentroController.deleteAdminCentro);

module.exports = router;
