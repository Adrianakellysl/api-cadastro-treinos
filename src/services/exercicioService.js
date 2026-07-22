const AppError = require('../utils/AppError');
const exercicioRepository = require('../repositories/exercicioRepository');

const findOwnedExercicio = async (id, userId) => {
  const exercicio = await exercicioRepository.findByIdAndUser(id, userId);
  if (!exercicio) {
    throw new AppError('Exercicio nao encontrado.', 404);
  }

  return exercicio;
};

module.exports = {
  create: (data, userId) => exercicioRepository.create({ ...data, usuario: userId }),

  findAll: (userId) => exercicioRepository.findAll({ usuario: userId }),

  findById: (id, userId) => findOwnedExercicio(id, userId),

  updateById: async (id, data, userId) => {
    await findOwnedExercicio(id, userId);
    return exercicioRepository.updateById(id, data);
  },

  deleteById: async (id, userId) => {
    const exercicio = await findOwnedExercicio(id, userId);
    await exercicioRepository.deleteById(exercicio.id);
    return exercicio;
  }
};
