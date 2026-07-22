const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const nivel = Joi.string().valid('iniciante', 'intermediario', 'avancado');

module.exports = {
  objectId,
  nivel
};
