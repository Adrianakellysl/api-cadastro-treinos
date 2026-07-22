const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autenticacao nao informado.', 401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError('Usuario autenticado nao encontrado.', 401);
    }

    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Token de autenticacao invalido.', 401);
  }
});

module.exports = authenticate;
