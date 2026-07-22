const asyncHandler = require('../utils/asyncHandler');
const treinoService = require('../services/treinoService');

module.exports = {
  create: asyncHandler(async (req, res) => {
    const treino = await treinoService.create(req.body, req.user.id);
    res.status(201).json(treino);
  }),

  findAll: asyncHandler(async (req, res) => {
    const result = await treinoService.findAll(req.query, req.user.id);
    res.status(200).json(result);
  }),

  findById: asyncHandler(async (req, res) => {
    const treino = await treinoService.findById(req.params.id, req.user.id);
    res.status(200).json(treino);
  }),

  updateById: asyncHandler(async (req, res) => {
    const treino = await treinoService.updateById(req.params.id, req.body, req.user.id);
    res.status(200).json(treino);
  }),

  deleteById: asyncHandler(async (req, res) => {
    await treinoService.deleteById(req.params.id, req.user.id);
    res.status(204).send();
  }),

  addExercicio: asyncHandler(async (req, res) => {
    const treino = await treinoService.addExercicio(req.params.id, req.body, req.user.id);
    res.status(201).json(treino);
  }),

  getStats: asyncHandler(async (req, res) => {
    const stats = await treinoService.getStats(req.user.id);
    res.status(200).json(stats);
  })
};
