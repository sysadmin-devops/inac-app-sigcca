// routes/adminGeralRoutes.js
const express = require('express');
const adminGeralController = require('../controllers/adminGeralController');
const upload = require('../middlewares/upload');


const router = express.Router();

router.get('/adminGeral', adminGeralController.getAllAdminsGerais);
router.get('/adminGeral/:id', adminGeralController.getAdminGeralById);
router.put('/adminGeral/:id', upload.single('imagem'), adminGeralController.updateAdminGeral);
router.delete('/adminGeral/:id', adminGeralController.deleteAdminGeral);

module.exports = router;
