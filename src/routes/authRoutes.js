const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authValidator = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', validate(authValidator.login), authController.login);

module.exports = router;
