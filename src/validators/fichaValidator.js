const Joi = require('joi');
const { objectId } = require('./common');

const fichaBody = Joi.object({
  nome: Joi.string().trim().min(3).required(),
  descricao: Joi.string().trim().min(10).required(),
  treinos: Joi.array().items(objectId.required()).min(1).required()
});

module.exports = {
  create: fichaBody,
  update: fichaBody.fork(Object.keys(fichaBody.describe().keys), (schema) => schema.optional()).min(1)
};
