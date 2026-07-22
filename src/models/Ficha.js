const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const fichaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    treinos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treino',
        required: true
      }
    ]
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

module.exports = mongoose.model('Ficha', fichaSchema);
