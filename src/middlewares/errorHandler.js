const mongoose = require('mongoose');

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'Identificador invalido.' });
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ error: 'Erro de validacao.', details });
  }

  const statusCode = error.statusCode || 500;
  const response = {
    error: statusCode === 500 ? 'Internal Server Error' : error.message
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
