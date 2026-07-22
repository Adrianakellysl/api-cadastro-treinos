const Ficha = require('../models/Ficha');
const createBaseRepository = require('./baseRepository');

module.exports = createBaseRepository(Ficha, ['treinos']);
