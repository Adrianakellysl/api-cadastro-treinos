const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

module.exports = {
  getResumo: asyncHandler(async (req, res) => {
    const resumo = await dashboardService.getResumo(req.user.id);
    res.status(200).json(resumo);
  }),

  getEvolucaoMensal: asyncHandler(async (req, res) => {
    const evolucao = await dashboardService.getEvolucaoMensal(req.user.id);
    res.status(200).json(evolucao);
  })
};
