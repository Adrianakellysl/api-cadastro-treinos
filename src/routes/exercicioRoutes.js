const express = require('express');
const exercicioController = require('../controllers/exercicioController');
const validate = require('../middlewares/validate');
const exercicioValidator = require('../validators/exercicioValidator');

const router = express.Router();

router.post('/', validate(exercicioValidator.create), exercicioController.create);
router.get('/', exercicioController.findAll);
router.get('/:id', exercicioController.findById);
router.put('/:id', validate(exercicioValidator.update), exercicioController.updateById);
router.delete('/:id', exercicioController.deleteById);

module.exports = router;
