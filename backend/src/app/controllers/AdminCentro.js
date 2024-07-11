// controllers/adminCentroController.js
const AdminCentro = require('../models/AdminCentro');

async function getAllAdminCentros(req, res) {
  try {
    const adminCentros = await AdminCentro.find().populate('centroAcolhimento', 'nome').sort({ _id: -1 });
    return res.json(adminCentros);
  } catch (err) {
    console.error('Erro ao obter todos os administradores de centro:', err);
    return res.status(500).send({ error: 'Erro ao obter todos os administradores de centro' });
  }
}

async function getAdminCentroById(req, res) {
  const { id } = req.params;

  try {
    const adminCentro = await AdminCentro.findById(id).populate('centroAcolhimento', 'nome');
    if (!adminCentro) {
      return res.status(404).send({ error: 'Administrador do centro não encontrado' });
    }
    return res.json(adminCentro);
  } catch (err) {
    console.error('Erro ao obter administrador do centro por ID:', err);
    return res.status(500).send({ error: 'Erro ao obter administrador do centro por ID' });
  }
}

async function updateAdminCentro(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Encontra o administrador pelo ID
    const adminCentro = await AdminCentro.findById(id).select('+senha');
    if (!adminCentro) {
      return res.status(404).send({ error: 'Administrador do centro não encontrado' });
    }

    // Verifica se o novo email já está em uso por outro administrador
    if (updateData.email && updateData.email !== adminCentro.email) {
      const emailExists = await AdminCentro.findOne({ email: updateData.email });
      if (emailExists) {
        return res.status(400).send({ error: 'O email já está em uso por outro administrador' });
      }
      adminCentro.email = updateData.email;
    }

    // Atualiza apenas os campos que foram fornecidos
    if (updateData.nome) {
      adminCentro.nome = updateData.nome;
    }
    if (updateData.senha) {
      // Atribui a nova senha, o middleware pre-save do Mongoose cuidará do hash
      adminCentro.senha = updateData.senha;
    }
    if (req.file) {
      // Atualiza o caminho da imagem se um novo arquivo foi enviado
      adminCentro.imagem = req.file.filename;
    }

    // Salva as alterações no banco de dados
    await adminCentro.save();

    // Remove a senha do objeto de retorno
    adminCentro.senha = undefined;

    return res.json(adminCentro);
  } catch (err) {
    console.error('Erro ao atualizar administrador do centro:', err);
    return res.status(500).send({ error: 'Erro ao atualizar administrador do centro' });
  }
}

async function deleteAdminCentro(req, res) {
  const { id } = req.params;

  try {
    const adminCentro = await AdminCentro.findByIdAndDelete(id);
    if (!adminCentro) {
      return res.status(404).send({ error: 'Administrador do centro não encontrado' });
    }
    return res.json({ message: 'Administrador do centro excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir administrador do centro:', err);
    return res.status(500).send({ error: 'Erro ao excluir administrador do centro' });
  }
}

module.exports = {
  getAllAdminCentros,
  getAdminCentroById,
  updateAdminCentro,
  deleteAdminCentro
};
