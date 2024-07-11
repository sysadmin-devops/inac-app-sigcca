const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://teste_inac:Yv01s4ePQkLnfcDF@cluster0.evchh1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

.then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

mongoose.Promise = global.Promise;

module.exports = mongoose;


