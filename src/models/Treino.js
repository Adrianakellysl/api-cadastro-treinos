const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const treinoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      required: true,
      enum: ['musculacao', 'cardio', 'funcional', 'mobilidade', 'casa']
    },
    nivel: {
      type: String,
      required: true,
      enum: ['iniciante', 'intermediario', 'avancado']
    },
    duracaoEstimada: { type: Number, required: true, min: 1 },
    caloriasEstimadas: { type: Number, required: true, min: 0 },
    exercicios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercicio',
        required: true
      }
    ],
    instrutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instrutor',
      required: true
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true, toJSON, toObject: toJSON }
);

module.exports = mongoose.model('Treino', treinoSchema);
