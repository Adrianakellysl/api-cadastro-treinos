const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');

const createToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

const serializeUser = (user) => ({
  id: user.id,
  nome: user.nome,
  email: user.email
});

const register = async (data) => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new AppError('Ja existe usuario cadastrado com este email.', 409);
  }

  const user = await userRepository.create(data);
  return {
    user: serializeUser(user),
    token: createToken(user)
  };
};

const login = async ({ email, senha }) => {
  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  const passwordMatches = await user.comparePassword(senha);
  if (!passwordMatches) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  return {
    user: serializeUser(user),
    token: createToken(user)
  };
};

module.exports = {
  register,
  login
};
