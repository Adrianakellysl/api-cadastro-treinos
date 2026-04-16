const memoryStore = require('../data/memoryStore');

const workoutController = {
  createWorkout: (req, res) => {
    try {
      const allowedKeys = [
        'nomeTreino', 'tipoTreino', 'duracaoMinutos',
        'nivel', 'caloriasEstimadas', 'dataTreino'
      ];

      const keys = Object.keys(req.body);

      // Verificação de campos extras
      const extraFields = keys.filter(key => !allowedKeys.includes(key));
      if (extraFields.length > 0) {
        return res.status(400).json({ error: `Campos não permitidos ou extras encontrados: ${extraFields.join(', ')}` });
      }

      const { nomeTreino, tipoTreino, duracaoMinutos, nivel, caloriasEstimadas, dataTreino } = req.body;

      // Validação: nomeTreino
      if (!nomeTreino || typeof nomeTreino !== 'string' || nomeTreino.trim().length < 3) {
        return res.status(400).json({ error: 'O campo "nomeTreino" é obrigatório e deve conter no mínimo 3 caracteres.' });
      }

      // Validação: tipoTreino
      const tiposPermitidos = ['musculacao', 'cardio', 'funcional'];
      if (!tipoTreino || !tiposPermitidos.includes(tipoTreino)) {
        return res.status(400).json({ error: 'O campo "tipoTreino" é obrigatório e deve ser um dos seguintes: musculacao, cardio, funcional.' });
      }

      // Validação: duracaoMinutos
      if (typeof duracaoMinutos !== 'number' || !Number.isInteger(duracaoMinutos) || duracaoMinutos <= 0 || duracaoMinutos > 300) {
        return res.status(400).json({ error: 'O campo "duracaoMinutos" é obrigatório, deve ser um número inteiro maior que 0 e menor ou igual a 300.' });
      }

      // Validação: nivel
      const niveisPermitidos = ['iniciante', 'intermediario', 'avancado'];
      if (!nivel || !niveisPermitidos.includes(nivel)) {
        return res.status(400).json({ error: 'O campo "nivel" é obrigatório e deve ser um dos seguintes: iniciante, intermediario, avancado.' });
      }

      // Validação: caloriasEstimadas (opcional)
      if (caloriasEstimadas !== undefined) {
        if (typeof caloriasEstimadas !== 'number' || !Number.isInteger(caloriasEstimadas) || caloriasEstimadas <= 0) {
          return res.status(400).json({ error: 'O campo "caloriasEstimadas", se enviada, deve ser um número inteiro maior que 0.' });
        }
      }

      // Validação: dataTreino (opcional)
      if (dataTreino !== undefined) {
        const regexData = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexData.test(dataTreino)) {
          return res.status(400).json({ error: 'O campo "dataTreino", se enviada, deve estar no formato YYYY-MM-DD.' });
        }

        // Adicionamos T12:00:00 para evitar problemas de fuso horário
        const dataFornecida = new Date(dataTreino + 'T12:00:00');

        if (isNaN(dataFornecida.getTime())) {
          return res.status(400).json({ error: 'A dataTreino é inválida no calendário.' });
        }

        const dataHoje = new Date();
        dataHoje.setHours(0, 0, 0, 0); // Zera as horas de hoje

        const dataFornecidaZera = new Date(dataFornecida);
        dataFornecidaZera.setHours(0, 0, 0, 0); // Zera as horas da data enviada

        if (dataFornecidaZera < dataHoje) {
          return res.status(400).json({ error: 'A "dataTreino" não pode ser no passado.' });
        }
      }

      // Validação: não permitir cadastro duplicado (mesmo nomeTreino + dataTreino)
      const dataVerificar = dataTreino || undefined;
      const hasDuplicate = memoryStore.checkDuplicate(nomeTreino.trim(), dataVerificar);
      if (hasDuplicate) {
        return res.status(400).json({ error: 'Não é permitido cadastro duplicado: já existe um treino com este mesmo "nomeTreino" e "dataTreino".' });
      }

      // Passou em 100% das validações rigorosas, cria o treino
      const newWorkout = memoryStore.createWorkout({
        nomeTreino: nomeTreino.trim(),
        tipoTreino,
        duracaoMinutos,
        nivel,
        caloriasEstimadas, // Irá ficar undefined se não eviar
        dataTreino: dataTreino // Irá ficar undefined se não enviar
      });

      return res.status(201).json(newWorkout);

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = workoutController;
