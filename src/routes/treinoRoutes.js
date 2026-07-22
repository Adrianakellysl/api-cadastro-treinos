const express = require('express');
const treinoController = require('../controllers/treinoController');
const validate = require('../middlewares/validate');
const treinoValidator = require('../validators/treinoValidator');
const exercicioValidator = require('../validators/exercicioValidator');

const router = express.Router();

router.post('/', validate(treinoValidator.create), treinoController.create);
router.get('/', validate(treinoValidator.query, 'query'), treinoController.findAll);
router.get('/estatisticas', treinoController.getStats);
router.get('/:id', treinoController.findById);
router.post('/:id/exercicios', validate(exercicioValidator.createForTreino), treinoController.addExercicio);
router.put('/:id', validate(treinoValidator.update), treinoController.updateById);
router.delete('/:id', treinoController.deleteById);

module.exports = router;
