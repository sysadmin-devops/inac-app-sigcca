// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
 authSecret: process.env.AUTH_SECRET,
 mailHost: process.env.MAIL_HOST,
 mailPort: process.env.MAIL_PORT,
 mailUser: process.env.MAIL_USER,
 mailPass: process.env.MAIL_PASS,
 // Adicione outras variáveis de ambiente conforme necessário
};
