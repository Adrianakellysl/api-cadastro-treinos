const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const treinoRepository = require('../repositories/treinoRepository');
const exercicioRepository = require('../repositories/exercicioRepository');
const instrutorRepository = require('../repositories/instrutorRepository');

const ensureTreinoRelations = async (data, userId) => {
  if (data.exercicios) {
    const uniqueExercicios = new Set(data.exercicios.map(String));
    if (uniqueExercicios.size !== data.exercicios.length) {
      throw new AppError('Nao e permitido repetir exercicios no mesmo treino.', 400);
    }

    const existingExercises = await exercicioRepository.count({
      _id: { $in: [...uniqueExercicios] },
      usuario: userId
    });

    if (existingExercises !== uniqueExercicios.size) {
      throw new AppError('Todo exercicio associado ao treino deve existir e pertencer ao usuario autenticado.', 400);
    }
  }

  if (data.instrutor) {
    const instrutor = await instrutorRepository.findById(data.instrutor);
    if (!instrutor) {
      throw new AppError('Instrutor responsavel nao encontrado.', 400);
    }
  }
};

const buildFilter = (query, userId) => {
  const filter = { usuario: userId };

  if (query.nome) {
    filter.nome = { $regex: query.nome, $options: 'i' };
  }

  if (query.tipo) {
    filter.tipo = query.tipo;
  }

  if (query.nivel) {
    filter.nivel = query.nivel;
  }

  if (query.duracaoMin || query.duracaoMax) {
    filter.duracaoEstimada = {};
    if (query.duracaoMin) {
      filter.duracaoEstimada.$gte = query.duracaoMin;
    }
    if (query.duracaoMax) {
      filter.duracaoEstimada.$lte = query.duracaoMax;
    }
  }

  return filter;
};

const findOwnedTreino = async (id, userId) => {
  const treino = await treinoRepository.findById(id);

  if (!treino || treino.usuario.id !== userId) {
    throw new AppError('Treino nao encontrado.', 404);
  }

  return treino;
};

module.exports = {
  create: async (data, userId) => {
    await ensureTreinoRelations(data, userId);
    const treino = await treinoRepository.create({ ...data, usuario: userId });
    return treinoRepository.findById(treino.id);
  },

  findAll: (query, userId) => {
    const page = Number(query.page);
    const limit = Number(query.limit);
    return treinoRepository.findPaginated(buildFilter(query, userId), { page, limit });
  },

  findById: (id, userId) => findOwnedTreino(id, userId),

  updateById: async (id, data, userId) => {
    await findOwnedTreino(id, userId);
    await ensureTreinoRelations(data, userId);
    return treinoRepository.updateById(id, data);
  },

  deleteById: async (id, userId) => {
    const treino = await findOwnedTreino(id, userId);
    await treinoRepository.deleteById(treino.id);
    return treino;
  },

  addExercicio: async (treinoId, exercicioData, userId) => {
    await findOwnedTreino(treinoId, userId);
    const exercicio = await exercicioRepository.create({
      ...exercicioData,
      treino: treinoId,
      usuario: userId
    });

    return treinoRepository.addExercicio(treinoId, exercicio.id);
  },

  getStats: async (userId) => {
    const [stats] = await treinoRepository.getStatsByUser(new mongoose.Types.ObjectId(userId));

    return {
      quantidadeTreinos: stats ? stats.quantidadeTreinos : 0,
      tempoTotal: stats ? stats.tempoTotal : 0,
      caloriasEstimadas: stats ? stats.caloriasEstimadas : 0
    };
  }
};
