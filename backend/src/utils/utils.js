const fs = require('fs');

async function deleteUploadedImage(req) {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Erro ao deletar imagem:', err);
    });
  }
}

module.exports = {
  deleteUploadedImage,
};
