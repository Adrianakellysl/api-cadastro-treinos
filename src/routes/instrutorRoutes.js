const express = require('express');
const instrutorController = require('../controllers/instrutorController');
const validate = require('../middlewares/validate');
const instrutorValidator = require('../validators/instrutorValidator');

const router = express.Router();

router.post('/', validate(instrutorValidator.create), instrutorController.create);
router.get('/', instrutorController.findAll);
router.get('/:id', instrutorController.findById);
router.put('/:id', validate(instrutorValidator.update), instrutorController.updateById);
router.delete('/:id', instrutorController.deleteById);

module.exports = router;
