const asyncHandler = require('../utils/asyncHandler');

const createCrudController = (service) => ({
  create: asyncHandler(async (req, res) => {
    const entity = await service.create(req.body);
    res.status(201).json(entity);
  }),

  findAll: asyncHandler(async (_req, res) => {
    const entities = await service.findAll();
    res.status(200).json(entities);
  }),

  findById: asyncHandler(async (req, res) => {
    const entity = await service.findById(req.params.id);
    res.status(200).json(entity);
  }),

  updateById: asyncHandler(async (req, res) => {
    const entity = await service.updateById(req.params.id, req.body);
    res.status(200).json(entity);
  }),

  deleteById: asyncHandler(async (req, res) => {
    await service.deleteById(req.params.id);
    res.status(204).send();
  })
});

module.exports = createCrudController;
