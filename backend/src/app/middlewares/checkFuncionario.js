const checkFuncionario = (req, res, next) => {
    const userRoles = req.user.roles;
  
    if (userRoles.includes('Funcionario')) {
      next();
    } else {
      res.status(403).send('Acesso negado');
    }
  };
  
  module.exports = checkFuncionario;