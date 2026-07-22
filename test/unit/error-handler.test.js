const { expect } = require('chai');
const mongoose = require('mongoose');
const errorHandler = require('../../src/middlewares/errorHandler');
const AppError = require('../../src/utils/AppError');

const createResponse = () => {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

describe('errorHandler', () => {
  it('deve tratar AppError com detalhes', () => {
    const res = createResponse();
    const error = new AppError('Falha de validacao.', 422, ['campo obrigatorio']);

    errorHandler(error, {}, res, () => {});

    expect(res.statusCode).to.equal(422);
    expect(res.body.details).to.have.length(1);
  });

  it('deve tratar erro interno sem expor detalhes', () => {
    const res = createResponse();

    errorHandler(new Error('erro sensivel'), {}, res, () => {});

    expect(res.statusCode).to.equal(500);
    expect(res.body.error).to.equal('Internal Server Error');
  });

  it('deve tratar ValidationError do mongoose', () => {
    const res = createResponse();
    const validationError = new mongoose.Error.ValidationError();
    validationError.addError('nome', new mongoose.Error.ValidatorError({ message: 'Nome invalido.' }));

    errorHandler(validationError, {}, res, () => {});

    expect(res.statusCode).to.equal(400);
    expect(res.body.error).to.equal('Erro de validacao.');
  });

  it('deve permitir criar AppError com valores padrao', () => {
    const error = new AppError('Erro padrao.');

    expect(error.statusCode).to.equal(400);
    expect(error.details).to.equal(null);
  });
});
