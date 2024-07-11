// controllers/adminGeralController.js

const AdminGeral = require('../models/AdminGeral');

// Obter todos os administradores gerais
async function getAllAdminsGerais(req, res) {
  try {
    const adminsGerais = await AdminGeral.find().sort({ _id: -1 });
    return res.json(adminsGerais);
  } catch (err) {
    console.error('Erro ao obter todos os administradores gerais:', err);
    return res.status(500).send({ error: 'Erro ao obter todos os administradores gerais' });
  }
}

// Obter administrador geral por ID
async function getAdminGeralById(req, res) {
  const { id } = req.params;

  try {
    const adminGeral = await AdminGeral.findById(id);
    if (!adminGeral) {
      return res.status(404).send({ error: 'Administrador geral não encontrado' });
    }
    return res.json(adminGeral);
  } catch (err) {
    console.error('Erro ao obter administrador geral por ID:', err);
    return res.status(500).send({ error: 'Erro ao obter administrador geral por ID' });
  }
}

// Atualizar administrador geral
async function updateAdminGeral(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Encontra o administrador pelo ID
    const adminGeral = await AdminGeral.findById(id).select('+senha');
    if (!adminGeral) {
      return res.status(404).send({ error: 'Administrador geral não encontrado' });
    }

    // Verifica se o novo email já está em uso por outro administrador
    if (updateData.email && updateData.email !== adminGeral.email) {
      const emailExists = await AdminGeral.findOne({ email: updateData.email });
      if (emailExists) {
        return res.status(400).send({ error: 'O email já está em uso por outro administrador' });
      }
      adminGeral.email = updateData.email;
    }

    // Atualiza apenas os campos que foram fornecidos
    if (updateData.nome) {
      adminGeral.nome = updateData.nome;
    }
    if (updateData.senha) {
      // Atribui a nova senha, o middleware pre-save do Mongoose cuidará do hash
      adminGeral.senha = updateData.senha;
    }
    if (req.file) {
      // Atualiza o caminho da imagem se um novo arquivo foi enviado
      adminGeral.imagem = req.file.filename;
    }

    // Salva as alterações no banco de dados
    await adminGeral.save();

    // Remove a senha do objeto de retorno
    adminGeral.senha = undefined;

    return res.json(adminGeral);
  } catch (err) {
    console.error('Erro ao atualizar administrador geral:', err);
    return res.status(500).send({ error: 'Erro ao atualizar administrador geral' });
  }
}

// Excluir administrador geral
async function deleteAdminGeral(req, res) {
  const { id } = req.params;

  try {
    const adminGeral = await AdminGeral.findByIdAndDelete(id);
    if (!adminGeral) {
      return res.status(404).send({ error: 'Administrador geral não encontrado' });
    }
    return res.json({ message: 'Administrador geral excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir administrador geral:', err);
    return res.status(500).send({ error: 'Erro ao excluir administrador geral' });
  }
}

module.exports = {
  getAllAdminsGerais,
  getAdminGeralById,
  updateAdminGeral,
  deleteAdminGeral
};
