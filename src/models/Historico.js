const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const historicoSchema = new mongoose.Schema(
  {
    treinoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treino',
      required: true
    },
    dataExecucao: { type: Date, required: true },
    duracaoReal: { type: Number, required: true, min: 1 },
    caloriasQueimadas: { type: Number, required: true, min: 0 },
    observacoes: { type: String, trim: true },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

module.exports = mongoose.model('Historico', historicoSchema);
