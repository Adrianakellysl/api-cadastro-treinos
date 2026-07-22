const Joi = require('joi');

const register = Joi.object({
  nome: Joi.string().trim().min(3).required(),
  email: Joi.string().email().lowercase().required(),
  senha: Joi.string().min(6).required()
});

const login = Joi.object({
  email: Joi.string().email().lowercase().required(),
  senha: Joi.string().required()
});

module.exports = {
  register,
  login
};
