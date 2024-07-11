const checkAdminCentro = (req, res, next) => {
    const userRoles = req.user.roles;
  
    if (userRoles.includes('AdminCentro')) {
      next();
    } else {
      res.status(403).send('Acesso negado');
    }
  };
  
  module.exports = checkAdminCentro;