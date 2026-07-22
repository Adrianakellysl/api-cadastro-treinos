const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const instrutorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    especialidade: { type: String, required: true, trim: true },
    biografia: { type: String, required: true, trim: true },
    foto: { type: String, required: true, trim: true },
    instagram: { type: String, trim: true },
    youtube: { type: String, trim: true }
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

module.exports = mongoose.model('Instrutor', instrutorSchema);
