/**
 * SUITE DE TESTES AUTOMATIZADOS - GYM WORKOUTS API
 * 
 * Objetivo: Validar todas as funcionalidades da API RESTful de gerenciamento de treinos
 * 
 * Cobertura:
 *  - Autenticação e segurança (JWT, proteção de rotas, validação de credenciais)
 *  - CRUD de Exercícios com validação de payload
 *  - CRUD de Instrutores com validação de dados
 *  - CRUD de Treinos com paginação, filtros e isolamento por usuário
 *  - Fichas de Treino como templates com treinos associados
 *  - Histórico de Treinos e Rastreamento de Desempenho
 *  - Dashboard e Estatísticas de Desempenho
 *  - Tratamento de Erros (404, 400, 401, 409)
 * 
 * Frameworks: Mocha, Chai, Supertest
 * Database: MongoDB com mongodb-memory-server (testes isolados)
 * 
 * Códigos HTTP Testados:
 *  - 201 Created: Criação bem-sucedida
 *  - 200 OK: Operações bem-sucedidas de leitura/atualização
 *  - 204 No Content: Deleção bem-sucedida
 *  - 400 Bad Request: Validação de entrada falhou
 *  - 401 Unauthorized: Autenticação falhou ou token inválido
 *  - 404 Not Found: Recurso não encontrado ou acesso negado
 *  - 409 Conflict: Email duplicado ou conflito de dados
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase
} = require('../helpers/database');

// ==================== DADOS MOCK PARA TESTES ====================

const exercicioPayload = {
  nome: 'Supino reto',
  descricao: 'Exercicio para desenvolvimento de peitoral.',
  grupoMuscular: 'peitoral',
  nivel: 'intermediario',
  equipamento: 'barra e banco',
  videoUrl: 'https://example.com/supino.mp4',
  imagemUrl: 'https://example.com/supino.jpg',
  instrucoesExecucao: ['Deite no banco', 'Desca a barra com controle'],
  errosComuns: ['Arquear demais a lombar', 'Descer a barra sem controle']
};

const instrutorPayload = {
  nome: 'Marina Costa',
  especialidade: 'hipertrofia',
  biografia: 'Instrutora com experiencia em treino de forca.',
  foto: 'https://example.com/marina.jpg',
  instagram: 'https://instagram.com/marina',
  youtube: 'https://youtube.com/@marina'
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Registra um novo usuário na API e retorna seu token JWT
 * @param {string} email - Email único do usuário (padrão: qa@example.com)
 * @returns {Promise<string>} Token JWT válido para autenticação
 */
const registerUser = async (email = 'qa@example.com') => {
  const res = await request(app)
    .post('/auth/register')
    .send({
      nome: 'QA Tester',
      email,
      senha: 'senha123'
    });

  return res.body.token;
};

/**
 * Cria um instrutor via POST /instrutores
 * @returns {Promise<object>} Response com ID do instrutor criado
 */
const createInstrutor = () => request(app).post('/instrutores').send(instrutorPayload);

/**
 * Cria um exercício autenticado via POST /exercicios
 * @param {string} token - Token JWT para autenticação
 * @param {object} payload - Dados do exercício (usa padrão se não fornecido)
 * @returns {Promise<object>} Response com ID do exercício criado
 */
const createExercicio = (token, payload = exercicioPayload) =>
  request(app).post('/exercicios').set(authHeader(token)).send(payload);

/**
 * Cria um treino completo com instrutor e exercícios
 * @param {string} token - Token JWT para autenticação
 * @param {object} overrides - Campos opcionais para sobrescrever padrões
 * @returns {Promise<object>} Response com ID do treino criado
 */
const createTreino = async (token, overrides = {}) => {
  const instrutor = await createInstrutor();

  return request(app)
    .post('/treinos')
    .set(authHeader(token))
    .send({
      nome: 'Treino A',
      descricao: 'Treino de membros superiores.',
      tipo: 'musculacao',
      nivel: 'intermediario',
      duracaoEstimada: 60,
      caloriasEstimadas: 400,
      exercicios: [],
      instrutor: instrutor.body.id,
      ...overrides
    });
};

// ==================== CONFIGURAÇÃO E LIFECYCLE DOS TESTES ====================

describe('Gym Workouts API', () => {
  before(async () => {
    await connectTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  after(async () => {
    await disconnectTestDatabase();
  });

  describe('Autenticação - Registro e Login com JWT', () => {
    // Validações: Criação de conta, geração de token, rejeição de duplicatas e credenciais inválidas
    
    it('deve registrar novo usuário com sucesso (201) e retornar token JWT válido', async () => {
      const registered = await request(app)
        .post('/auth/register')
        .send({ nome: 'Aluno Teste', email: 'aluno@example.com', senha: 'senha123' });

      expect(registered.status).to.equal(201);
      expect(registered.body).to.have.property('token');
      expect(registered.body.user.email).to.equal('aluno@example.com');

      const login = await request(app)
        .post('/auth/login')
        .send({ email: 'aluno@example.com', senha: 'senha123' });

      expect(login.status).to.equal(200);
      expect(login.body).to.have.property('token');
    });

    it('deve rejeitar registro com email duplicado (409) e rejeitar login com senha incorreta (401)', async () => {
      await registerUser('duplicado@example.com');

      const duplicated = await request(app)
        .post('/auth/register')
        .send({ nome: 'Outro Usuario', email: 'duplicado@example.com', senha: 'senha123' });
      expect(duplicated.status).to.equal(409);

      const invalid = await request(app)
        .post('/auth/login')
        .send({ email: 'duplicado@example.com', senha: 'errada' });
      expect(invalid.status).to.equal(401);
    });

    it('deve retornar 401 quando tentar acessar rota protegida sem token JWT', async () => {
      const res = await request(app).get('/treinos');

      expect(res.status).to.equal(401);
      expect(res.body.error).to.include('Token');
    });

    it('deve rejeitar requisição com token JWT inválido (401)', async () => {
      const res = await request(app).get('/treinos').set(authHeader('token-invalido'));

      expect(res.status).to.equal(401);
      expect(res.body.error).to.include('invalido');
    });

    it('deve rejeitar login com email não cadastrado (401)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'ninguem@example.com', senha: 'senha123' });

      expect(res.status).to.equal(401);
    });
  });

  describe('Health Check - Verificação de Status da API', () => {
    // Valida se a API está operacional
    
    it('deve retornar status ok (200) indicando que a API está funcionando', async () => {
      const res = await request(app).get('/health');

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
    });
  });

  describe('Exercícios - Gerenciamento Completo', () => {
    // Testa CRUD com validação de payload, isolamento por usuário e erros 404
    
    it('deve executar fluxo CRUD completo de exercício: criar (201), listar (200), buscar (200), atualizar (200), deletar (204)', async () => {
      const token = await registerUser();

      const created = await createExercicio(token);
      expect(created.status).to.equal(201);
      expect(created.body).to.have.property('id');

      const list = await request(app).get('/exercicios').set(authHeader(token));
      expect(list.status).to.equal(200);
      expect(list.body).to.have.length(1);

      const found = await request(app).get(`/exercicios/${created.body.id}`).set(authHeader(token));
      expect(found.status).to.equal(200);
      expect(found.body.nome).to.equal('Supino reto');

      const updated = await request(app)
        .put(`/exercicios/${created.body.id}`)
        .set(authHeader(token))
        .send({ nivel: 'avancado' });
      expect(updated.status).to.equal(200);
      expect(updated.body.nivel).to.equal('avancado');

      const removed = await request(app).delete(`/exercicios/${created.body.id}`).set(authHeader(token));
      expect(removed.status).to.equal(204);
    });

    it('deve retornar 400 quando criar exercício com payload inválido (campos obrigatórios ausentes)', async () => {
      const token = await registerUser();
      const res = await request(app).post('/exercicios').set(authHeader(token)).send({ nome: 'A' });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Dados de entrada invalidos.');
    });

    it('deve retornar 404 ao tentar buscar exercício com ID inválido/inexistente', async () => {
      const token = await registerUser();
      const res = await request(app)
        .get('/exercicios/507f1f77bcf86cd799439011')
        .set(authHeader(token));

      expect(res.status).to.equal(404);
    });
  });

  describe('Instrutores - Gerenciamento Completo', () => {
    // Testa CRUD de instrutores sem isolamento de usuário
    
    it('deve executar fluxo CRUD completo de instrutor: criar (201), atualizar (200), listar (200), deletar (204)', async () => {
      const created = await createInstrutor();
      expect(created.status).to.equal(201);

      const updated = await request(app)
        .put(`/instrutores/${created.body.id}`)
        .send({ especialidade: 'mobilidade' });
      expect(updated.status).to.equal(200);
      expect(updated.body.especialidade).to.equal('mobilidade');

      const list = await request(app).get('/instrutores');
      expect(list.body).to.have.length(1);

      const removed = await request(app).delete(`/instrutores/${created.body.id}`);
      expect(removed.status).to.equal(204);
    });
  });

  describe('Treinos - Gerenciamento com Paginação e Filtros', () => {
    // Testa CRUD com paginação, filtros avançados, isolamento por usuário e validação de relacionamentos
    
    it('deve executar fluxo CRUD de treino com paginação: criar (201), listar com paginação (200), buscar (200), atualizar (200), deletar (204)', async () => {
      const token = await registerUser();
      const treino = await createTreino(token);

      expect(treino.status).to.equal(201);
      expect(treino.body.usuario.email).to.equal('qa@example.com');

      const list = await request(app)
        .get('/treinos?page=1&limit=5')
        .set(authHeader(token));
      expect(list.status).to.equal(200);
      expect(list.body.items).to.have.length(1);
      expect(list.body.pagination.total).to.equal(1);

      const found = await request(app).get(`/treinos/${treino.body.id}`).set(authHeader(token));
      expect(found.status).to.equal(200);
      expect(found.body.nome).to.equal('Treino A');

      const updated = await request(app)
        .put(`/treinos/${treino.body.id}`)
        .set(authHeader(token))
        .send({ duracaoEstimada: 70 });
      expect(updated.status).to.equal(200);
      expect(updated.body.duracaoEstimada).to.equal(70);

      const removed = await request(app).delete(`/treinos/${treino.body.id}`).set(authHeader(token));
      expect(removed.status).to.equal(204);
    });

    it('deve retornar resultados filtrados (200) ao pesquisar por nome, tipo, nível e intervalo de duração', async () => {
      const token = await registerUser();
      await createTreino(token, { nome: 'Treino Cardio', tipo: 'cardio', nivel: 'iniciante', duracaoEstimada: 30 });
      await createTreino(token, { nome: 'Treino Forca', tipo: 'musculacao', nivel: 'avancado', duracaoEstimada: 90 });

      const filtered = await request(app)
        .get('/treinos?nome=cardio&tipo=cardio&nivel=iniciante&duracaoMin=20&duracaoMax=40')
        .set(authHeader(token));

      expect(filtered.status).to.equal(200);
      expect(filtered.body.items).to.have.length(1);
      expect(filtered.body.items[0].nome).to.equal('Treino Cardio');
    });

    it('deve retornar 400 quando o intervalo de duração é inválido (duracaoMin > duracaoMax)', async () => {
      const token = await registerUser();
      const res = await request(app)
        .get('/treinos?duracaoMin=80&duracaoMax=20')
        .set(authHeader(token));

      expect(res.status).to.equal(400);
    });

    it('deve retornar 404 quando usuário tenta acessar treino de outro usuário (isolamento de dados)', async () => {
      const ownerToken = await registerUser('owner@example.com');
      const otherToken = await registerUser('other@example.com');
      const treino = await createTreino(ownerToken);

      const res = await request(app).get(`/treinos/${treino.body.id}`).set(authHeader(otherToken));

      expect(res.status).to.equal(404);
    });

    it('deve adicionar exercício a treino existente (201) e associar corretamente ao treino', async () => {
      const token = await registerUser();
      const treino = await createTreino(token);

      const res = await request(app)
        .post(`/treinos/${treino.body.id}/exercicios`)
        .set(authHeader(token))
        .send(exercicioPayload);

      expect(res.status).to.equal(201);
      expect(res.body.exercicios).to.have.length(1);
      expect(res.body.exercicios[0].treino.id).to.equal(treino.body.id);
    });

    it('deve rejeitar (400) exercícios duplicados ou inexistentes ao criar treino', async () => {
      const token = await registerUser();
      const exercicio = await createExercicio(token);
      const instrutor = await createInstrutor();

      const duplicated = await request(app)
        .post('/treinos')
        .set(authHeader(token))
        .send({
          nome: 'Treino duplicado',
          descricao: 'Treino com duplicidade proposital.',
          tipo: 'musculacao',
          nivel: 'iniciante',
          duracaoEstimada: 45,
          caloriasEstimadas: 250,
          exercicios: [exercicio.body.id, exercicio.body.id],
          instrutor: instrutor.body.id
        });

      expect(duplicated.status).to.equal(400);

      const missing = await request(app)
        .post('/treinos')
        .set(authHeader(token))
        .send({
          nome: 'Treino invalido',
          descricao: 'Treino com exercicio inexistente.',
          tipo: 'musculacao',
          nivel: 'iniciante',
          duracaoEstimada: 45,
          caloriasEstimadas: 250,
          exercicios: ['507f1f77bcf86cd799439011'],
          instrutor: instrutor.body.id
        });

      expect(missing.status).to.equal(400);
    });
  });

  describe('Fichas de Treino - Gerenciamento de Templates', () => {
    // Testa criação de templates de treino com validação de relacionamentos e isolamento de usuário
    
    it('deve criar ficha de treino (201) com treinos associados existentes', async () => {
      const token = await registerUser();
      const treino = await createTreino(token);

      const created = await request(app)
        .post('/fichas')
        .set(authHeader(token))
        .send({
          nome: 'Ficha ABC',
          descricao: 'Ficha dividida em tres dias.',
          treinos: [treino.body.id]
        });

      expect(created.status).to.equal(201);
      expect(created.body.treinos).to.have.length(1);
    });

    it('deve rejeitar (400) fichas com treinos duplicados ou treinos inexistentes', async () => {
      const token = await registerUser();
      const treino = await createTreino(token);

      const duplicated = await request(app)
        .post('/fichas')
        .set(authHeader(token))
        .send({
          nome: 'Ficha duplicada',
          descricao: 'Ficha com treino repetido.',
          treinos: [treino.body.id, treino.body.id]
        });
      expect(duplicated.status).to.equal(400);

      const missing = await request(app)
        .post('/fichas')
        .set(authHeader(token))
        .send({
          nome: 'Ficha invalida',
          descricao: 'Ficha com treino inexistente.',
          treinos: ['507f1f77bcf86cd799439011']
        });
      expect(missing.status).to.equal(400);
    });
  });

  describe('Histórico, Dashboard e Estatísticas - Rastreamento de Desempenho', () => {
    // Testa registro de histórico, cálculo de métricas e isolamento de dados entre usuários
    
    it('deve registrar histórico de treino (201), listar (200), buscar (200) e retornar métricas no dashboard (200)', async () => {
      const token = await registerUser();
      const treino = await createTreino(token);

      const historico = await request(app)
        .post('/historico')
        .set(authHeader(token))
        .send({
          treinoId: treino.body.id,
          dataExecucao: new Date().toISOString(),
          duracaoReal: 50,
          caloriasQueimadas: 300,
          observacoes: 'Boa evolucao de carga.'
        });

      expect(historico.status).to.equal(201);

      const list = await request(app).get('/historico').set(authHeader(token));
      expect(list.status).to.equal(200);
      expect(list.body).to.have.length(1);

      const found = await request(app).get(`/historico/${historico.body.id}`).set(authHeader(token));
      expect(found.status).to.equal(200);
      expect(found.body.caloriasQueimadas).to.equal(300);

      const resumo = await request(app).get('/dashboard/resumo').set(authHeader(token));
      expect(resumo.status).to.equal(200);
      expect(resumo.body.totalTreinosRealizados).to.equal(1);
      expect(resumo.body.caloriasAcumuladas).to.equal(300);

      const evolucao = await request(app).get('/dashboard/evolucao-mensal').set(authHeader(token));
      expect(evolucao.status).to.equal(200);
      expect(evolucao.body[0].totalTreinos).to.equal(1);

      const estatisticas = await request(app).get('/treinos/estatisticas').set(authHeader(token));
      expect(estatisticas.status).to.equal(200);
      expect(estatisticas.body.quantidadeTreinos).to.equal(1);
      expect(estatisticas.body.tempoTotal).to.equal(60);
      expect(estatisticas.body.caloriasEstimadas).to.equal(400);
    });

    it('deve retornar estatísticas zeradas (200) quando usuário não possui treinos registrados', async () => {
      const token = await registerUser();

      const estatisticas = await request(app).get('/treinos/estatisticas').set(authHeader(token));

      expect(estatisticas.status).to.equal(200);
      expect(estatisticas.body.quantidadeTreinos).to.equal(0);
      expect(estatisticas.body.tempoTotal).to.equal(0);
      expect(estatisticas.body.caloriasEstimadas).to.equal(0);
    });

    it('deve rejeitar (400) registro de histórico ao tentar rastrear treino de outro usuário', async () => {
      const ownerToken = await registerUser('owner@example.com');
      const otherToken = await registerUser('other@example.com');
      const treino = await createTreino(ownerToken);

      const res = await request(app)
        .post('/historico')
        .set(authHeader(otherToken))
        .send({
          treinoId: treino.body.id,
          dataExecucao: new Date().toISOString(),
          duracaoReal: 50,
          caloriasQueimadas: 300
        });

      expect(res.status).to.equal(400);
    });
  });

  describe('Tratamento de Erros - Validações e Exceções', () => {
    // Testa respostas de erro: 404 (não encontrado), 400 (formato inválido)
    
    it('deve retornar 404 quando acessar rota inexistente', async () => {
      const res = await request(app).get('/rota-inexistente');

      expect(res.status).to.equal(404);
    });

    it('deve retornar 400 quando usar identificador em formato inválido (não é ObjectId válido)', async () => {
      const token = await registerUser();
      const res = await request(app).get('/exercicios/id-invalido').set(authHeader(token));

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Identificador invalido.');
    });
  });
});
