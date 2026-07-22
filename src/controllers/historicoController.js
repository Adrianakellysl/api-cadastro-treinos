const asyncHandler = require('../utils/asyncHandler');
const historicoService = require('../services/historicoService');

module.exports = {
  create: asyncHandler(async (req, res) => {
    const historico = await historicoService.create(req.body, req.user.id);
    res.status(201).json(historico);
  }),

  findAll: asyncHandler(async (req, res) => {
    const historico = await historicoService.findAll(req.user.id);
    res.status(200).json(historico);
  }),

  findById: asyncHandler(async (req, res) => {
    const historico = await historicoService.findById(req.params.id, req.user.id);
    res.status(200).json(historico);
  })
};
