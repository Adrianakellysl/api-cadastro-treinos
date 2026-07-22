const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const exercicioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    grupoMuscular: { type: String, required: true, trim: true },
    nivel: {
      type: String,
      required: true,
      enum: ['iniciante', 'intermediario', 'avancado']
    },
    equipamento: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    imagemUrl: { type: String, required: true, trim: true },
    instrucoesExecucao: [{ type: String, required: true, trim: true }],
    errosComuns: [{ type: String, required: true, trim: true }],
    treino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treino'
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

module.exports = mongoose.model('Exercicio', exercicioSchema);
