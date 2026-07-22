const fichaService = require('../services/fichaService');
const createCrudController = require('./controllerFactory');

module.exports = createCrudController(fichaService);
