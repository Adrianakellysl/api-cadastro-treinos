const Joi = require('joi');
const { nivel } = require('./common');

const exercicioBody = Joi.object({
  nome: Joi.string().trim().min(3).required(),
  descricao: Joi.string().trim().min(10).required(),
  grupoMuscular: Joi.string().trim().min(2).required(),
  nivel: nivel.required(),
  equipamento: Joi.string().trim().min(2).required(),
  videoUrl: Joi.string().uri().required(),
  imagemUrl: Joi.string().uri().required(),
  instrucoesExecucao: Joi.array().items(Joi.string().trim().min(3)).min(1).required(),
  errosComuns: Joi.array().items(Joi.string().trim().min(3)).min(1).required()
});

module.exports = {
  create: exercicioBody,
  createForTreino: exercicioBody,
  update: exercicioBody.fork(Object.keys(exercicioBody.describe().keys), (schema) => schema.optional()).min(1)
};
