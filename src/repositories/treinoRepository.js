const Treino = require('../models/Treino');
const createBaseRepository = require('./baseRepository');

const baseRepository = createBaseRepository(Treino, ['exercicios', 'instrutor', 'usuario']);

module.exports = {
  ...baseRepository,

  findPaginated: async (filter, { page, limit }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Treino.find(filter)
        .populate([
          { path: 'exercicios', populate: ['treino', 'usuario'] },
          'instrutor',
          'usuario'
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Treino.countDocuments(filter)
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  },

  getStatsByUser: (usuario) =>
    Treino.aggregate([
      { $match: { usuario } },
      {
        $group: {
          _id: '$usuario',
          quantidadeTreinos: { $sum: 1 },
          tempoTotal: { $sum: '$duracaoEstimada' },
          caloriasEstimadas: { $sum: '$caloriasEstimadas' }
        }
      }
    ]),

  addExercicio: (treinoId, exercicioId) =>
    Treino.findByIdAndUpdate(
      treinoId,
      { $addToSet: { exercicios: exercicioId } },
      { returnDocument: 'after', runValidators: true }
    ).populate([
      { path: 'exercicios', populate: ['treino', 'usuario'] },
      'instrutor',
      'usuario'
    ])
};
