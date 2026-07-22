const AppError = require('../utils/AppError');
const historicoRepository = require('../repositories/historicoRepository');
const treinoRepository = require('../repositories/treinoRepository');

const ensureOwnedTreinoExists = async (treinoId, userId) => {
  const treino = await treinoRepository.findById(treinoId);
  if (!treino || treino.usuario.id !== userId) {
    throw new AppError('Treino informado no historico nao encontrado.', 400);
  }
};

module.exports = {
  create: async (data, userId) => {
    await ensureOwnedTreinoExists(data.treinoId, userId);
    return historicoRepository.create({ ...data, usuario: userId });
  },

  findAll: (userId) => historicoRepository.findAll({ usuario: userId }),

  findById: async (id, userId) => {
    const historico = await historicoRepository.findByIdAndUser(id, userId);
    if (!historico) {
      throw new AppError('Historico nao encontrado.', 404);
    }
    return historico;
  }
};
