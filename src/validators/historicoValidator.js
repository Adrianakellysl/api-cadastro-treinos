const Joi = require('joi');
const { objectId } = require('./common');

const historicoBody = Joi.object({
  treinoId: objectId.required(),
  dataExecucao: Joi.date().iso().required(),
  duracaoReal: Joi.number().integer().min(1).max(600).required(),
  caloriasQueimadas: Joi.number().integer().min(0).required(),
  observacoes: Joi.string().trim().allow('').optional()
});

module.exports = {
  create: historicoBody
};
