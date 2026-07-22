const Exercicio = require('../models/Exercicio');
const createBaseRepository = require('./baseRepository');

const baseRepository = createBaseRepository(Exercicio, ['treino', 'usuario']);

module.exports = {
  ...baseRepository,

  findByIdAndUser: (id, usuario) => Exercicio.findOne({ _id: id, usuario }).populate(['treino', 'usuario'])
};
