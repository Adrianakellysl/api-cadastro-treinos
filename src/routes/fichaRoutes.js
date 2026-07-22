const express = require('express');
const fichaController = require('../controllers/fichaController');
const validate = require('../middlewares/validate');
const fichaValidator = require('../validators/fichaValidator');

const router = express.Router();

router.post('/', validate(fichaValidator.create), fichaController.create);
router.get('/', fichaController.findAll);
router.get('/:id', fichaController.findById);
router.put('/:id', validate(fichaValidator.update), fichaController.updateById);
router.delete('/:id', fichaController.deleteById);

module.exports = router;
