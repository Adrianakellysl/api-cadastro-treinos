const AppError = require('../utils/AppError');
const fichaRepository = require('../repositories/fichaRepository');
const treinoRepository = require('../repositories/treinoRepository');
const createCrudService = require('./crudServiceFactory');

const baseService = createCrudService(fichaRepository, 'Ficha');

const ensureTreinosExist = async (treinos = []) => {
  const uniqueTreinos = new Set(treinos.map(String));
  if (uniqueTreinos.size !== treinos.length) {
    throw new AppError('Nao e permitido repetir treinos na mesma ficha.', 400);
  }

  const existingTreinos = await treinoRepository.countByIds([...uniqueTreinos]);
  if (existingTreinos !== uniqueTreinos.size) {
    throw new AppError('Todo treino associado a ficha deve existir.', 400);
  }
};

module.exports = {
  ...baseService,

  create: async (data) => {
    await ensureTreinosExist(data.treinos);
    return fichaRepository.create(data);
  },

  updateById: async (id, data) => {
    if (data.treinos) {
      await ensureTreinosExist(data.treinos);
    }
    return baseService.updateById(id, data);
  }
};
