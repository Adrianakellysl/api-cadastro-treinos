const Joi = require('joi');

const instrutorBody = Joi.object({
  nome: Joi.string().trim().min(3).required(),
  especialidade: Joi.string().trim().min(3).required(),
  biografia: Joi.string().trim().min(10).required(),
  foto: Joi.string().uri().required(),
  instagram: Joi.string().uri().optional(),
  youtube: Joi.string().uri().optional()
});

module.exports = {
  create: instrutorBody,
  update: instrutorBody.fork(Object.keys(instrutorBody.describe().keys), (schema) => schema.optional()).min(1)
};
