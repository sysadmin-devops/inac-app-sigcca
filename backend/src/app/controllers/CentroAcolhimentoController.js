const CentroAcolhimento = require('../models/CentroAcolhimento');
const path = require('path');
const utils = require('../../utils/utils')

async function registerCentroAcolhimento(req, res) {
  try {
    const {
      nome,
      endereco,
      telefone,
      email,
      capacidade,
      modalidadeAcolhimento,
      recursosHumanos,
      infraestrutura,
      descricao
    } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !endereco || !telefone || !email || !capacidade || !modalidadeAcolhimento || !recursosHumanos || !infraestrutura) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req);
      return res.status(400).send({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Verifica o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Deletar a imagem já salva (se existir)
      await utils.deleteUploadedImage(req);
      return res.status(400).send({ error: 'O email fornecido não é válido' });
    }

    // Cria um novo centro de acolhimento com os dados fornecidos
    const novoCentro = new CentroAcolhimento({
      nome,
      endereco,
      telefone,
      email,
      capacidade,
      modalidadeAcolhimento,
      recursosHumanos,
      infraestrutura,
      descricao
    });

    // Verifica se há uma imagem anexada na requisição
    if (req.file) {
      novoCentro.imagem = req.file.filename;
    }

    // Salva o centro de acolhimento no banco de dados
    const centroSalvo = await novoCentro.save();

    return res.status(201).json(centroSalvo);
  } catch (error) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    console.error('Erro ao cadastrar centro de acolhimento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao cadastrar centro de acolhimento' });
  }
}

async function getAllCentros(req, res) {
  try {
    const centros = await CentroAcolhimento.find().sort({ _id: -1 });
    return res.json(centros);
  } catch (err) {
    console.error('Erro ao obter todos os centros de acolhimento:', err);
    return res.status(500).send({ error: 'Erro ao obter todos os centros de acolhimento' });
  }
}

async function getCentroById(req, res) {
  const { id } = req.params;

  try {
    const centro = await CentroAcolhimento.findById(id);
    if (!centro) {
      return res.status(404).send({ error: 'Centro de acolhimento não encontrado' });
    }
    return res.json(centro);
  } catch (err) {
    console.error('Erro ao obter centro de acolhimento por ID:', err);
    return res.status(500).send({ error: 'Erro ao obter centro de acolhimento por ID' });
  }
}

async function updateCentro(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const centro = await CentroAcolhimento.findById(id);
    if (!centro) {
      return res.status(404).send({ error: 'Centro de acolhimento não encontrado' });
    }

    // Atualiza apenas os campos que foram fornecidos
    if (updateData.nome) {
      centro.nome = updateData.nome;
    }
    if (updateData.endereco) {
      centro.endereco = updateData.endereco;
    }
    if (updateData.telefone) {
      centro.telefone = updateData.telefone;
    }
    if (updateData.email) {
      centro.email = updateData.email;
    }
    if (updateData.capacidade) {
      centro.capacidade = updateData.capacidade;
    }
    if (updateData.modalidadeAcolhimento) {
      centro.modalidadeAcolhimento = updateData.modalidadeAcolhimento;
    }
    if (updateData.recursosHumanos) {
      centro.recursosHumanos = updateData.recursosHumanos;
    }
    if (updateData.infraestrutura) {
      centro.infraestrutura = updateData.infraestrutura;
    }
    if (updateData.descricao) {
      centro.descricao = updateData.descricao;
    }
    if (req.file) {
      // Atualiza o caminho da imagem se um novo arquivo foi enviado
      centro.imagem = req.file.filename;
    }

    // Salva as alterações no banco de dados
    await centro.save();

    return res.json(centro);
  } catch (err) {
    console.error('Erro ao atualizar centro de acolhimento:', err);
    return res.status(500).send({ error: 'Erro ao atualizar centro de acolhimento' });
  }
}

async function deleteCentro(req, res) {
  const { id } = req.params;

  try {
    const centro = await CentroAcolhimento.findByIdAndDelete(id);
    if (!centro) {
      return res.status(404).send({ error: 'Centro de acolhimento não encontrado' });
    }
    return res.json({ message: 'Centro de acolhimento excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir centro de acolhimento:', err);
    return res.status(500).send({ error: 'Erro ao excluir centro de acolhimento' });
  }
}

module.exports = {
  registerCentroAcolhimento,
  getAllCentros,
  getCentroById,
  updateCentro,
  deleteCentro
};
