const AppError = require('../utils/AppError');

const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Rota nao encontrada: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFoundHandler;
