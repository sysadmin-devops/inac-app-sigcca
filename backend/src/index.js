const express = require('express');
const bodyParser = require('body-parser'); // Pode ser removido se não estiver usando diretamente
const path = require('path');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middleware para servir imagens estáticas
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do parser de corpo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Importação e uso das rotas
const funcionarioRoutes = require('./app/routes/funcionarioRoutes');
const criancaRoutes = require('./app/routes/criancaRoutes');
const centroRoutes = require('./app/routes/centroRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const adminGeralRoutes = require('./app/routes/adminGeralRoutes');
const authRoutes = require('./app/routes/authRoutes');

app.use('/api', funcionarioRoutes);
app.use('/api', criancaRoutes);
app.use('/api', centroRoutes);
app.use('/api', adminRoutes);
app.use('/api', adminGeralRoutes);
app.use('/auth', authRoutes);

// Tratamento de erros
app.use((req, res, next) => {
  res.status(404).send("Página não encontrada");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro interno do servidor");
});

// Configuração da porta para ouvir
const port = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
