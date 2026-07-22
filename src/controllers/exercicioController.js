const asyncHandler = require('../utils/asyncHandler');
const exercicioService = require('../services/exercicioService');

module.exports = {
  create: asyncHandler(async (req, res) => {
    const exercicio = await exercicioService.create(req.body, req.user.id);
    res.status(201).json(exercicio);
  }),

  findAll: asyncHandler(async (req, res) => {
    const exercicios = await exercicioService.findAll(req.user.id);
    res.status(200).json(exercicios);
  }),

  findById: asyncHandler(async (req, res) => {
    const exercicio = await exercicioService.findById(req.params.id, req.user.id);
    res.status(200).json(exercicio);
  }),

  updateById: asyncHandler(async (req, res) => {
    const exercicio = await exercicioService.updateById(req.params.id, req.body, req.user.id);
    res.status(200).json(exercicio);
  }),

  deleteById: asyncHandler(async (req, res) => {
    await exercicioService.deleteById(req.params.id, req.user.id);
    res.status(204).send();
  })
};
