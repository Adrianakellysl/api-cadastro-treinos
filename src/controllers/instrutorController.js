const instrutorService = require('../services/instrutorService');
const createCrudController = require('./controllerFactory');

module.exports = createCrudController(instrutorService);
