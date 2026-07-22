const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const auth = await authService.register(req.body);
    res.status(201).json(auth);
  }),

  login: asyncHandler(async (req, res) => {
    const auth = await authService.login(req.body);
    res.status(200).json(auth);
  })
};
