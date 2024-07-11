const bcrypt = require('bcryptjs');
const Funcionario = require('../models/Funcionario');
const CentroAcolhimento = require('../models/CentroAcolhimento');

async function getAllFuncionarios(req, res) {
  try {
    const funcionarios = await Funcionario.find().populate('centroAcolhimento', 'nome').sort({ _id: -1 });;
    return res.json(funcionarios);
  } catch (err) {
    console.error('Erro ao obter todos os funcionários:', err);
    return res.status(500).send({ error: 'Erro ao obter todos os funcionários' });
  }
}

async function getFuncionarioById(req, res) {
  const { id } = req.params;

  try {
    const funcionario = await Funcionario.findById(id).populate('centroAcolhimento', 'nome');
    if (!funcionario) {
      return res.status(404).send({ error: 'Funcionário não encontrado' });
    }
    return res.json(funcionario);
  } catch (err) {
    console.error('Erro ao obter funcionário por ID:', err);
    return res.status(500).send({ error: 'Erro ao obter funcionário por ID' });
  }
}

async function updateFuncionario(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Encontra o funcionário pelo ID
    const funcionario = await Funcionario.findById(id).select('+senha');
    if (!funcionario) {
      return res.status(404).send({ error: 'Funcionário não encontrado' });
    }

    // Verifica se o novo email já está em uso por outro funcionário
    if (updateData.email && updateData.email !== funcionario.email) {
      const emailExists = await Funcionario.findOne({ email: updateData.email });
      if (emailExists) {
        return res.status(400).send({ error: 'O email já está em uso por outro funcionário' });
      }
      funcionario.email = updateData.email;
    }

    // Atualiza apenas os campos que foram fornecidos
    if (updateData.nome) {
      funcionario.nome = updateData.nome;
    }
    if (updateData.senha) {
      // Atribui a nova senha, o middleware pre-save do Mongoose cuidará do hash
      funcionario.senha = updateData.senha;
    }
    if (req.file) {
      // Atualiza o caminho da imagem se um novo arquivo foi enviado
      funcionario.imagem = req.file.filename;
    }

    // Salva as alterações no banco de dados
    await funcionario.save();

    // Remove a senha do objeto de retorno
    funcionario.senha = undefined;

    return res.json(funcionario);
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    return res.status(500).send({ error: 'Erro ao atualizar funcionário' });
  }
}
async function deleteFuncionario(req, res) {
  const { id } = req.params;

  try {
    const funcionario = await Funcionario.findByIdAndDelete(id);
    if (!funcionario) {
      return res.status(404).send({ error: 'Funcionário não encontrado' });
    }
    return res.json({ message: 'Funcionário excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir funcionário:', err);
    return res.status(500).send({ error: 'Erro ao excluir funcionário' });
  }
}

// Controller para buscar crianças adicionadas por um funcionário em um determinado centro
async function buscarCriancasPorFuncionarioEcentro(req, res) {
  const { funcionarioId, centroId } = req.params;
  try {
    const criancas = await Crianca.find({ funcionarioResponsavel: funcionarioId, centroAcolhimento: centroId });
    res.json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças por funcionário e centro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getAllFuncionarios,
  getFuncionarioById,
  updateFuncionario,
  deleteFuncionario,
  buscarCriancasPorFuncionarioEcentro
};
