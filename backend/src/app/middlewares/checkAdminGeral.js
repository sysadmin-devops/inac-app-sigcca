const checkAdminGeral = (req, res, next) => {
    const userRoles = req.user.roles;
  
    if (userRoles.includes('AdminGeral')) {
      next();
    } else {
      res.status(403).send('Acesso negado');
    }
  };
  
  module.exports = checkAdminGeral;