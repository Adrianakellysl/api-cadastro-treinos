const Historico = require('../models/Historico');
const createBaseRepository = require('./baseRepository');

const baseRepository = createBaseRepository(Historico, ['treinoId', 'usuario']);

module.exports = {
  ...baseRepository,
  findByIdAndUser: (id, usuario) => Historico.findOne({ _id: id, usuario }).populate(['treinoId', 'usuario']),
  aggregate: (pipeline) => Historico.aggregate(pipeline)
};
