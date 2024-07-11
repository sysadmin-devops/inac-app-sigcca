const fs = require('fs');

function convertImageToBase64(imagePath) {
  try {
    const imageData = fs.readFileSync(`./src/uploads/${imagePath}`);
    const base64Image = imageData.toString('base64');
    const dataURI = `data:image/${getImageType(imagePath)};base64,${base64Image}`;
    return dataURI;
  } catch (error) {
    console.error('Erro ao converter a imagem:', error);
    return null; // Ou lance um erro, dependendo da sua lógica de tratamento de erros
  }
}

function getImageType(imagePath) {
  const extension = imagePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    // Adicione mais tipos de imagem conforme necessário (gif, bmp, etc.)
    default:
      return 'unknown';
  }
}

module.exports = { convertImageToBase64 }