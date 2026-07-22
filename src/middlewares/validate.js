const AppError = require('../utils/AppError');

const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new AppError('Dados de entrada invalidos.', 400, details));
  }

  req[property] = value;
  return next();
};

module.exports = validate;
