const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/resumo', dashboardController.getResumo);
router.get('/evolucao-mensal', dashboardController.getEvolucaoMensal);

module.exports = router;
