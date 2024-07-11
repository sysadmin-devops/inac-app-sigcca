const checkFuncionarioRole = (req, res, next) => {
    const { user } = req;
    if (!user || user.role !== 'Funcionario') {
      return res.status(403).json({ error: 'Acesso negado. Esta rota é apenas para funcionários.' });
    }
    next();
  };
  
  module.exports = checkFuncionarioRole;
  