const checkAdminGeralRole = (req, res, next) => {
    const { user } = req;
    if (!user || user.role !== 'AdminGeral') {
      return res.status(403).json({ error: 'Acesso negado. Esta rota é apenas para administradores gerais.' });
    }
    next();
  };
  
  module.exports = checkAdminGeralRole;
  