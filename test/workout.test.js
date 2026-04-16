const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const memoryStore = require('../src/data/memoryStore');

describe('API de Treinos (Gym Workouts)', () => {
  beforeEach(() => {
    // Limpar o array de treinos antes de cada bloco inteiro de testes (para isolar os estados)
    memoryStore.clearStore();
  });

  it('1. Deve cadastrar um treino com sucesso retornando código 201', async () => {
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Treino de Peito",
      tipoTreino: "musculacao",
      duracaoMinutos: 45,
      nivel: "intermediario",
      dataTreino: "2050-01-01" // Garantindo sempre uma data alta para não cair no passado da validação
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.nomeTreino).to.equal("Treino de Peito");
  });

  it('2. Não deve aceitar campos extras na requisição', async () => {
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Costas",
      tipoTreino: "musculacao",
      duracaoMinutos: 60,
      nivel: "avancado",
      lixoIntruso: "Maldade da requisição!"
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('Campos não permitidos'); // Validando se aponta o erro de campos intrusos
  });

  it('3. Deve rejeitar durações fora das limitações exigidas (<1 ou >300 minutos)', async () => {
    // Forçando 0 minutos
    const res1 = await request(app).post('/treinos').send({
      nomeTreino: "Esteira", tipoTreino: "cardio", duracaoMinutos: 0, nivel: "iniciante"
    });
    expect(res1.status).to.equal(400);

    // Forçando estourar limite máximo (500)
    const res2 = await request(app).post('/treinos').send({
      nomeTreino: "Ultramaratona", tipoTreino: "cardio", duracaoMinutos: 500, nivel: "avancado"
    });
    expect(res2.status).to.equal(400);
  });

  it('4. Deve validar erros de dados tipificados que não pertecem às opções oficiais', async () => {
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Abdomen",
      tipoTreino: "funcional",
      duracaoMinutos: 20,
      nivel: "super_pesado" // Nível inexistente
    });

    expect(res.status).to.equal(400);
  });

  it('5. Não deve aceitar cadastro de mesma data e nome (Erro Composto de Duplicidade)', async () => {
    // Injeção do 1º cadastro
    await request(app).post('/treinos').send({
      nomeTreino: "Biceps", tipoTreino: "musculacao", duracaoMinutos: 30, nivel: "iniciante", dataTreino: "2050-10-10"
    });

    // Alguém tenta cadastrar o nome igual com data igual no 2º envio
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Biceps", tipoTreino: "musculacao", duracaoMinutos: 40, nivel: "avancado", dataTreino: "2050-10-10"
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('cadastro duplicado');
  });

  it('6. Não deve permitir cadastros cuja Data represente histórico passado', async () => {
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Reliquia Cardio", tipoTreino: "cardio", duracaoMinutos: 30, nivel: "iniciante", dataTreino: "1999-01-01"
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('passado');
  });

  it('7. Deve aceitar o limite máximo de 300 minutos e rejeitar 301', async () => {
    // Testando o limite exato (deve passar)
    const resSucesso = await request(app).post('/treinos').send({
      nomeTreino: "Maratona de Cardio",
      tipoTreino: "cardio",
      duracaoMinutos: 300,
      nivel: "avancado"
    });
    expect(resSucesso.status).to.equal(201);

    // Testando um minuto acima do limite (deve dar erro)
    const resErro = await request(app).post('/treinos').send({
      nomeTreino: "Maratona de Cardio Plus",
      tipoTreino: "cardio",
      duracaoMinutos: 301,
      nivel: "avancado"
    });
    expect(resErro.status).to.equal(400);
    expect(resErro.body.error).to.include('300');
  });

  it('8. Deve remover espaços em branco desnecessários no nome do treino', async () => {
    const res = await request(app).post('/treinos').send({
      // Nome cheio de espaços no início e no fim
      nomeTreino: "   Yoga Relax   ",
      tipoTreino: "funcional",
      duracaoMinutos: 45,
      nivel: "iniciante"
    });

    expect(res.status).to.equal(201);
    // Verifica se a API salvou o nome "limpo" (sem os espaços)
    expect(res.body.nomeTreino).to.equal("Yoga Relax");
  });

  it('9. Deve rejeitar se a duração for enviada como texto (string) em vez de número', async () => {
    const res = await request(app).post('/treinos').send({
      nomeTreino: "Treino de Teste",
      tipoTreino: "musculacao",
      duracaoMinutos: "60", // Aqui está o "erro": enviando como texto entre aspas
      nivel: "intermediario"
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('número inteiro');
  });
});
