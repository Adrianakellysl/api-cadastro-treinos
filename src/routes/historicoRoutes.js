const express = require('express');
const historicoController = require('../controllers/historicoController');
const validate = require('../middlewares/validate');
const historicoValidator = require('../validators/historicoValidator');

const router = express.Router();

router.post('/', validate(historicoValidator.create), historicoController.create);
router.get('/', historicoController.findAll);
router.get('/:id', historicoController.findById);

module.exports = router;
