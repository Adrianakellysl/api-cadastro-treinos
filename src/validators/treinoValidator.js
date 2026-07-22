const Joi = require('joi');
const { nivel, objectId } = require('./common');

const treinoBody = Joi.object({
  nome: Joi.string().trim().min(3).required(),
  descricao: Joi.string().trim().min(10).required(),
  tipo: Joi.string().valid('musculacao', 'cardio', 'funcional', 'mobilidade', 'casa').required(),
  nivel: nivel.required(),
  duracaoEstimada: Joi.number().integer().min(1).max(300).required(),
  caloriasEstimadas: Joi.number().integer().min(0).required(),
  exercicios: Joi.array().items(objectId).unique().default([]),
  instrutor: objectId.required()
});

const treinoQuery = Joi.object({
  nome: Joi.string().trim().optional(),
  tipo: Joi.string().valid('musculacao', 'cardio', 'funcional', 'mobilidade', 'casa').optional(),
  nivel: nivel.optional(),
  duracaoMin: Joi.number().integer().min(1).optional(),
  duracaoMax: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
}).custom((value, helpers) => {
  if (value.duracaoMin && value.duracaoMax && value.duracaoMin > value.duracaoMax) {
    return helpers.error('any.invalid');
  }

  return value;
}, 'intervalo de duracao valido');

module.exports = {
  create: treinoBody,
  update: treinoBody.fork(Object.keys(treinoBody.describe().keys), (schema) => schema.optional()).min(1),
  query: treinoQuery
};
