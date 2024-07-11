const checkAdminCentroRole = (req, res, next) => {
    const { user } = req;
    if (!user || user.role !== 'AdminCentro') {
      return res.status(403).json({ error: 'Acesso negado. Esta rota é apenas para administradores de centro.' });
    }
    next();
  };
  
  module.exports = checkAdminCentroRole;
  