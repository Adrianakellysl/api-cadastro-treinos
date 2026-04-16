const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const memoryStore = require('../src/data/memoryStore');

describe('API de Treinos (Gym Workouts)', () => {

  beforeEach(() => {
    memoryStore.clearStore();
  });

  // ================================
  // CENÁRIOS DE SUCESSO
  // ================================
  describe('Cadastro de Treinos - Sucesso', () => {

    it('1. Deve cadastrar um treino com sucesso retornando código 201', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Treino de Peito",
        tipoTreino: "musculacao",
        duracaoMinutos: 45,
        nivel: "intermediario",
        dataTreino: "2050-01-01"
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.nomeTreino).to.equal("Treino de Peito");
    });

    it('2. Deve remover espaços em branco desnecessários no nome do treino', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "   Yoga Relax   ",
        tipoTreino: "funcional",
        duracaoMinutos: 45,
        nivel: "iniciante"
      });

      expect(res.status).to.equal(201);
      expect(res.body.nomeTreino).to.equal("Yoga Relax");
    });

  });

  // ================================
  // VALIDAÇÕES DE CAMPOS
  // ================================
  describe('Validações de Campos', () => {

    it('3. Não deve aceitar campos extras na requisição', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Costas",
        tipoTreino: "musculacao",
        duracaoMinutos: 60,
        nivel: "avancado",
        intruso: "Maldade da requisição!"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('Campos não permitidos');
    });

    it('4. Deve rejeitar se a duração for enviada como texto (string)', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Treino de Teste",
        tipoTreino: "musculacao",
        duracaoMinutos: "60",
        nivel: "intermediario"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('número inteiro');
    });

    it('5. Deve rejeitar caso um campo obrigatório não seja informado', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Treino de força",
        duracaoMinutos: 100,
        nivel: "iniciante",
        dataTreino: "2026-04-22"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('tipoTreino');
    });

    it('6. Deve rejeitar se um campo obrigatório estiver vazio', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Treino de cardio",
        tipoTreino: "cardio",
        duracaoMinutos: 100,
        nivel: "",
        dataTreino: "2026-04-22"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('nivel');
    });

  });

  // ================================
  // REGRAS DE NEGÓCIO
  // ================================
  describe('Regras de Negócio', () => {

    it('7. Deve rejeitar durações fora das limitações (<1 ou >300)', async () => {
      const res1 = await request(app).post('/treinos').send({
        nomeTreino: "Esteira",
        tipoTreino: "cardio",
        duracaoMinutos: 0,
        nivel: "iniciante"
      });

      expect(res1.status).to.equal(400);

      const res2 = await request(app).post('/treinos').send({
        nomeTreino: "Ultramaratona",
        tipoTreino: "cardio",
        duracaoMinutos: 500,
        nivel: "avancado"
      });

      expect(res2.status).to.equal(400);
    });

    it('8. Deve validar dados tipificados inválidos', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Abdomen",
        tipoTreino: "funcional",
        duracaoMinutos: 20,
        nivel: "super_pesado"
      });

      expect(res.status).to.equal(400);
    });

    it('9. Não deve aceitar cadastro duplicado (nome + data)', async () => {
      await request(app).post('/treinos').send({
        nomeTreino: "Biceps",
        tipoTreino: "musculacao",
        duracaoMinutos: 30,
        nivel: "iniciante",
        dataTreino: "2050-10-10"
      });

      const res = await request(app).post('/treinos').send({
        nomeTreino: "Biceps",
        tipoTreino: "musculacao",
        duracaoMinutos: 40,
        nivel: "avancado",
        dataTreino: "2050-10-10"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('cadastro duplicado');
    });

    it('10. Não deve permitir datas no passado', async () => {
      const res = await request(app).post('/treinos').send({
        nomeTreino: "Reliquia Cardio",
        tipoTreino: "cardio",
        duracaoMinutos: 30,
        nivel: "iniciante",
        dataTreino: "1999-01-01"
      });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('passado');
    });

    it('11. Deve aceitar 300 e rejeitar 301 minutos', async () => {
      const resSucesso = await request(app).post('/treinos').send({
        nomeTreino: "Maratona de Cardio",
        tipoTreino: "cardio",
        duracaoMinutos: 300,
        nivel: "avancado"
      });

      expect(resSucesso.status).to.equal(201);

      const resErro = await request(app).post('/treinos').send({
        nomeTreino: "Maratona de Cardio Plus",
        tipoTreino: "cardio",
        duracaoMinutos: 301,
        nivel: "avancado"
      });

      expect(resErro.status).to.equal(400);
      expect(resErro.body.error).to.include('300');
    });

  });

});