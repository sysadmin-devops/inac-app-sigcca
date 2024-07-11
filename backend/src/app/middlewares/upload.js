const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Caminho absoluto para o diretório de uploads
const uploadsDir = path.resolve(__dirname, '../../uploads');

// Verifica se a pasta 'uploads' existe, se não, cria a pasta
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para armazenar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, uploadsDir);
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({ storage: storage });

module.exports = upload;
