const instrutorRepository = require('../repositories/instrutorRepository');
const createCrudService = require('./crudServiceFactory');

module.exports = createCrudService(instrutorRepository, 'Instrutor');
