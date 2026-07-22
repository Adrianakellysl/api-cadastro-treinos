const mongoose = require('mongoose');
const historicoRepository = require('../repositories/historicoRepository');

const getDateKey = (date) => date.toISOString().slice(0, 10);

const calculateStreak = (history) => {
  const trainedDays = new Set(history.map((item) => getDateKey(item.dataExecucao)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (trainedDays.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const getResumo = async (userId) => {
  const history = await historicoRepository.findAll({ usuario: userId });
  const totalTreinosRealizados = history.length;
  const caloriasAcumuladas = history.reduce((total, item) => total + item.caloriasQueimadas, 0);
  const minutosTreinados = history.reduce((total, item) => total + item.duracaoReal, 0);

  return {
    totalTreinosRealizados,
    diasConsecutivosTreinando: calculateStreak(history),
    caloriasAcumuladas,
    horasTreinadas: Number((minutosTreinados / 60).toFixed(2))
  };
};

const getEvolucaoMensal = async (userId) => {
  const result = await historicoRepository.aggregate([
    { $match: { usuario: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          ano: { $year: '$dataExecucao' },
          mes: { $month: '$dataExecucao' }
        },
        totalTreinos: { $sum: 1 },
        caloriasQueimadas: { $sum: '$caloriasQueimadas' },
        minutosTreinados: { $sum: '$duracaoReal' }
      }
    },
    { $sort: { '_id.ano': 1, '_id.mes': 1 } }
  ]);

  return result.map((item) => ({
    ano: item._id.ano,
    mes: item._id.mes,
    totalTreinos: item.totalTreinos,
    caloriasQueimadas: item.caloriasQueimadas,
    horasTreinadas: Number((item.minutosTreinados / 60).toFixed(2))
  }));
};

module.exports = {
  getResumo,
  getEvolucaoMensal
};
