const AppError = require('../utils/AppError');

const createCrudService = (repository, entityName) => ({
  create: (data) => repository.create(data),

  findAll: () => repository.findAll(),

  findById: async (id) => {
    const entity = await repository.findById(id);
    if (!entity) {
      throw new AppError(`${entityName} nao encontrado.`, 404);
    }
    return entity;
  },

  updateById: async (id, data) => {
    const entity = await repository.updateById(id, data);
    if (!entity) {
      throw new AppError(`${entityName} nao encontrado.`, 404);
    }
    return entity;
  },

  deleteById: async (id) => {
    const entity = await repository.deleteById(id);
    if (!entity) {
      throw new AppError(`${entityName} nao encontrado.`, 404);
    }
    return entity;
  }
});

module.exports = createCrudService;
