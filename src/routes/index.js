const express = require('express');
const exercicioRoutes = require('./exercicioRoutes');
const treinoRoutes = require('./treinoRoutes');
const instrutorRoutes = require('./instrutorRoutes');
const fichaRoutes = require('./fichaRoutes');
const historicoRoutes = require('./historicoRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const authRoutes = require('./authRoutes');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/exercicios', authenticate, exercicioRoutes);
router.use('/treinos', authenticate, treinoRoutes);
router.use('/instrutores', instrutorRoutes);
router.use('/fichas', authenticate, fichaRoutes);
router.use('/historico', authenticate, historicoRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);

module.exports = router;
