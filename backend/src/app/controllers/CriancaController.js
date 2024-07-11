const Crianca = require('../models/Crianca');
const mongoose = require('mongoose');
const utils = require('../../utils/utils')

const {convertImageToBase64} = require("../middlewares/imageUtils")


// Controller para criar uma nova criança
async function criarCrianca(req, res) {
  const {
    nome_completo,
    nome_desconhecido,
    sexo,
    filiacao,
    provincia,
    municipio,
    nacionalidade,
    distrito,
    bairro,
    naturalidade,
    zona_vivia,
    ponto_referencia,
    data_nascimento,
    caracteristicas,
    contacto_familiar,
    escola,
    entidade_responsavel_crianca,
    antecedentes_crianca,
    motivo_saida,
    acompanhamento_tecnico,
    processo_reunificacao,
  } = req.body;

  // Verifique se todos os campos obrigatórios estão presentes no corpo da requisição
  if (!nome_completo || !sexo || !provincia || !nacionalidade || !data_nascimento) {
    // Deletar a imagem já salva (se existir)
    await utils.deleteUploadedImage(req);
    return res.status(400).send({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  // Verificar se o usuário está autenticado
  if (!req.userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Associar a criança ao centro de acolhimento do usuário autenticado
  let centroAcolhimentoId;
  if (req.userRole === 'funcionario') {
    centroAcolhimentoId = req.funcionario.centroAcolhimento;
  } else if (req.userRole === 'adminCentro') {
    centroAcolhimentoId = req.adminCentro.centroAcolhimento;
  } else if (req.userRole === 'adminGeral') {
    centroAcolhimentoId = req.adminGeral.centroAcolhimento;
  } else {
    return res.status(403).json({ error: 'Acesso negado: papel não permitido para cadastro de crianças' });
  }

  try {
    // Verificar se uma criança com os mesmos dados já existe
    const duplicata = await Crianca.findOne({ nome_completo, data_nascimento, sexo, nacionalidade });
    if (duplicata) {
      return res.status(400).json({ error: 'Uma criança com os mesmos dados já existe' });
    }

    // Cria a nova criança
    const novaCrianca = new Crianca({
      nome_completo,
      nome_desconhecido,
      sexo,
      filiacao,
      provincia,
      municipio,
      nacionalidade,
      distrito,
      bairro,
      naturalidade,
      zona_vivia,
      ponto_referencia,
      data_nascimento,
      caracteristicas,
      contacto_familiar,
      escola,
      entidade_responsavel_crianca,
      antecedentes_crianca,
      motivo_saida,
      acompanhamento_tecnico,
      processo_reunificacao,
      centroAcolhimento: centroAcolhimentoId,
    });

    // Verifica se há um arquivo de imagem no corpo da requisição
    if (req.file) {
      novaCrianca.imagem = req.file.filename;
    }

    await novaCrianca.save();
    const userId = req.userId;

    res.status(201).json({ child: novaCrianca, userId });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.warn('Erro de validação ao criar criança:', error);
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
        details: error.errors,
      });
    } else {
      await utils.deleteUploadedImage(req);
      console.error('Erro ao criar criança:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}



// Controller para buscar todas as crianças
async function buscarTodasCriancas(req, res) {
  try {
    let criancas = await Crianca.find().populate('centroAcolhimento', 'nome').sort({ _id: -1 });
    res.json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar uma criança por ID
async function buscarCriancaPorId(req, res) {
  try {
    const { id } = req.params;

    // Validação do ID com Mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Buscar a criança por ID
    let crianca = await Crianca.findById(id).populate('centroAcolhimento', 'nome');

    if (!crianca) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Verificar se deve converter a imagem para base64
    if (crianca.imagem) {
      try {
        const base64Image = await convertImageToBase64(crianca.imagem);

        // Adiciona a imagem convertida ao objeto crianca
        crianca.imagemBase64 = base64Image;
      } catch (error) {
        console.error('Erro ao converter imagem para Base64:', error);
        // Trate o erro conforme necessário, por exemplo, retornando uma resposta de erro
        return res.status(500).json({ error: 'Erro ao converter imagem para Base64' });
      }
    }

    res.status(200).json(crianca);
  } catch (error) {
    console.error('Erro ao buscar criança por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


// Controller para atualizar uma criança por ID
async function atualizarCrianca(req, res) {
  const { id } = req.params;
  const updateData = req.body; // Dados a serem atualizados

  try {
    // Validação dos dados atualizados
    if (!updateData.nome_completo || !updateData.sexo || !updateData.provincia || !updateData.nacionalidade) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Adiciona o caminho da imagem se um novo arquivo foi enviado
    if (req.file) {
      updateData.imagem = req.file.filename;
    }

    // Atualiza a data de atualização
    updateData.data_atualizacao = new Date();

    // Atualiza a criança no banco de dados
    const criancaAtualizada = await Crianca.findByIdAndUpdate(id, updateData, { new: true });

    if (!criancaAtualizada) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }

    // Retorna a criança atualizada
    res.json(criancaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar criança por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
// Controller para excluir uma criança por ID
async function excluirCrianca(req, res) {
  const { id } = req.params;
  try {
    const criancaExcluida = await Crianca.findByIdAndDelete(id);
    if (!criancaExcluida) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    res.json({ message: 'Criança excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir criança por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar crianças por centro de acolhimento
async function buscarCriancasPorCentro(req, res) {
  const { centroId } = req.params;
  try {
    const criancas = await Crianca.find({ centroAcolhimento: centroId }).populate('centroAcolhimento', 'nome');
    res.status(200).json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças por centro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar crianças por província
async function buscarCriancasPorProvincia(req, res) {
  const { provincia } = req.params;
  try {
    const criancas = await Crianca.find({ provincia }).populate('centroAcolhimento', 'nome');
    res.status(200).json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças por província:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar crianças por município
async function buscarCriancasPorMunicipio(req, res) {
  const { municipio } = req.params;
  try {
    const criancas = await Crianca.find({ municipio }).populate('centroAcolhimento', 'nome');
    res.status(200).json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças por município:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar crianças por nacionalidade
async function buscarCriancasPorNacionalidade(req, res) {
  const { nacionalidade } = req.params;
  try {
    const criancas = await Crianca.find({ nacionalidade }).populate('centroAcolhimento', 'nome');
    res.status(200).json(criancas);
  } catch (error) {
    console.error('Erro ao buscar crianças por nacionalidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Controller para buscar a quantidade de crianças por província em ordem alfabética
async function buscarQuantidadeCriancasPorProvinciaOrdenado(req, res) {
  try {
    const resultado = await Crianca.aggregate([
      { $group: { _id: '$provincia', count: { $sum: 1 } } },
    ]);

    // 2. Criar um mapa com todas as províncias de Angola e zero crianças
    const todasProvincias = {
      Bengo: 0,
      Benguela: 0,
      Bié: 0,
      Cabinda: 0,
      'Cuando Cubango': 0,
      'Cuanza Norte': 0,
      'Cuanza Sul': 0,
      Cunene: 0,
      Huambo: 0,
      Huíla: 0,
      Luanda: 0,
      'Lunda Norte': 0,
      'Lunda Sul': 0,
      Malanje: 0,
      Moxico: 0,
      Namibe: 0,
      Uíge: 0,
      Zaire: 0,
    };

    // 3. Atualizar o mapa com os resultados da agregação
    resultado.forEach((item) => {
      if (todasProvincias.hasOwnProperty(item._id)) {
        // Verifica se a província existe na lista
        todasProvincias[item._id] = item.count;
      }
    });

    res.json(todasProvincias);
  } catch (error) {
    console.error(
      'Erro ao buscar quantidade de crianças por província:',
      error
    );
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  criarCrianca,
  buscarTodasCriancas,
  buscarCriancaPorId,
  atualizarCrianca,
  excluirCrianca,
  buscarCriancasPorCentro,
  buscarCriancasPorProvincia,
  buscarCriancasPorMunicipio,
  buscarCriancasPorNacionalidade,
  buscarQuantidadeCriancasPorProvinciaOrdenado,
};
