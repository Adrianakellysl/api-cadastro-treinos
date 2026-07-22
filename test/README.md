# 📋 Testes Automatizados - Gym Workouts API

## Visão Geral

Suite completa de testes automatizados para a **Gym Workouts API** utilizando **Mocha**, **Chai** e **Supertest**. Todos os testes são executados contra um banco de dados MongoDB em memória (`mongodb-memory-server`) para garantir isolamento e velocidade.

---

## 🏗️ Estrutura dos Testes

```
test/
├── api/
│   └── gym-api.test.js          # Suite principal de testes de API
├── unit/
│   └── error-handler.test.js    # Testes unitários de tratamento de erros
├── helpers/
│   └── database.js              # Configuração de BD para testes
└── README.md                     # Este arquivo
```

---

## 🔬 Suites de Testes Detalhadas

### 1️⃣ **Autenticação - Registro e Login com JWT**

**Objetivo**: Validar segurança, geração de tokens e proteção de rotas

| Teste                                      | HTTP                                       | Validação                            |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------ |
| Registrar novo usuário e obter token       | `POST /auth/register`                      | 201, token válido, email correto     |
| Rejeitar email duplicado e senha incorreta | `POST /auth/register` + `POST /auth/login` | 409 (duplicado), 401 (senha errada)  |
| Proteger rotas sem token                   | `GET /treinos` sem header                  | 401, mensagem de erro inclui "Token" |
| Rejeitar token JWT inválido                | `GET /treinos` com token falso             | 401, mensagem inclui "inválido"      |
| Rejeitar login de usuário inexistente      | `POST /auth/login`                         | 401                                  |

**Códigos Esperados**: `201`, `200`, `401`, `409`

---

### 2️⃣ **Health Check - Verificação de Status da API**

**Objetivo**: Confirmar operacionalidade básica da API

| Teste                        | Endpoint      | Validação         |
| ---------------------------- | ------------- | ----------------- |
| Verificar status operacional | `GET /health` | 200, `status: ok` |

**Códigos Esperados**: `200`

---

### 3️⃣ **Exercícios - Gerenciamento Completo**

**Objetivo**: Testar CRUD com validação, isolamento por usuário e tratamento de erros

| Teste                      | Fluxo                                  | Validação                             |
| -------------------------- | -------------------------------------- | ------------------------------------- |
| **CRUD Completo**          | Create → Read → List → Update → Delete | `201` → `200` → `200` → `200` → `204` |
| **Validação de Payload**   | POST com campo obrigatório faltando    | `400`, mensagem de erro específica    |
| **Recurso Não Encontrado** | GET com ID inválido                    | `404`                                 |

**Características de Segurança**:

- ✅ Isolamento por usuário
- ✅ Validação de entrada (Joi)
- ✅ Verificação de existência

**Códigos Esperados**: `201`, `200`, `204`, `400`, `404`

---

### 4️⃣ **Instrutores - Gerenciamento Completo**

**Objetivo**: Testar CRUD sem isolamento por usuário (dados públicos)

| Teste             | Fluxo                           | Validação                     |
| ----------------- | ------------------------------- | ----------------------------- |
| **CRUD Completo** | Create → Update → List → Delete | `201` → `200` → `200` → `204` |

**Características**:

- ✅ Dados não isolados por usuário
- ✅ Acesso público para leitura

**Códigos Esperados**: `201`, `200`, `204`

---

### 5️⃣ **Treinos - Gerenciamento com Paginação e Filtros**

**Objetivo**: Testar CRUD com paginação, filtros avançados e isolamento por usuário

| Teste                      | Fluxo                                                      | Validação                                           |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| **CRUD com Paginação**     | Create → List (page/limit) → Read → Update → Delete        | `201` → `200` com paginação → `200` → `200` → `204` |
| **Filtros Múltiplos**      | GET com `?nome=X&tipo=Y&nivel=Z&duracaoMin=A&duracaoMax=B` | `200`, 1 resultado correspondente                   |
| **Validação de Intervalo** | GET com `duracaoMin > duracaoMax`                          | `400`                                               |
| **Isolamento de Usuário**  | User B tenta acessar treino de User A                      | `404`                                               |
| **Exercício em Treino**    | POST `/treinos/:id/exercicios`                             | `201`, exercício vinculado                          |
| **Exercícios Duplicados**  | POST treino com mesmo exercício 2x                         | `400`                                               |
| **Exercício Inexistente**  | POST treino com ID de exercício falso                      | `400`                                               |

**Características de Segurança**:

- ✅ Isolamento rigoroso por usuário
- ✅ Paginação com validação
- ✅ Filtros validados
- ✅ Validação de relacionamentos

**Códigos Esperados**: `201`, `200`, `204`, `400`, `404`

---

### 6️⃣ **Fichas de Treino - Gerenciamento de Templates**

**Objetivo**: Testar criação de templates de treino com validação de relacionamentos

| Teste                  | Fluxo                                 | Validação                              |
| ---------------------- | ------------------------------------- | -------------------------------------- |
| **Criar Ficha**        | POST `/fichas` com treinos existentes | `201`, treinos associados corretamente |
| **Treinos Duplicados** | POST com mesmo treino 2x              | `400`                                  |
| **Treino Inexistente** | POST com ID de treino falso           | `400`                                  |

**Características**:

- ✅ Validação de relacionamentos
- ✅ Prevenção de duplicatas
- ✅ Isolamento por usuário

**Códigos Esperados**: `201`, `400`

---

### 7️⃣ **Histórico, Dashboard e Estatísticas - Rastreamento de Desempenho**

**Objetivo**: Testar registro de treinos realizados e cálculo de métricas

| Teste                       | Fluxo                                                     | Validação                                     |
| --------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| **Histórico Completo**      | Create → List → Read histórico + Dashboard + Estatísticas | `201` → `200` (3 endpoints)                   |
| **Resumo do Dashboard**     | GET `/dashboard/resumo`                                   | `200`, totalTreinosRealizados=1, calorias=300 |
| **Evolução Mensal**         | GET `/dashboard/evolucao-mensal`                          | `200`, array com dados mensais                |
| **Estatísticas de Treinos** | GET `/treinos/estatisticas`                               | `200`, quantidadeTreinos=1, tempoTotal=60     |
| **Estatísticas Zeradas**    | Novo usuário sem treinos                                  | `200`, todos os valores = 0                   |
| **Isolamento**              | User B tenta registrar treino de User A                   | `400`                                         |

**Características**:

- ✅ Cálculo de métricas agregadas
- ✅ Isolamento rigoroso de dados
- ✅ Tratamento de casos vazios

**Códigos Esperados**: `201`, `200`, `400`

---

### 8️⃣ **Tratamento de Erros - Validações e Exceções**

**Objetivo**: Validar respostas de erro da API

| Teste                | Cenário                       | Validação                                |
| -------------------- | ----------------------------- | ---------------------------------------- |
| **Rota Inexistente** | GET `/rota-inexistente`       | `404`                                    |
| **ID Inválido**      | GET `/exercicios/id-invalido` | `400`, mensagem "Identificador inválido" |

**Códigos Esperados**: `404`, `400`

---

## 📊 Cobertura de Códigos HTTP

| Código  | Significado  | Testes                              |
| ------- | ------------ | ----------------------------------- |
| **201** | Created      | POST para criar recursos            |
| **200** | OK           | GET, PUT, POST de sucesso           |
| **204** | No Content   | DELETE bem-sucedido                 |
| **400** | Bad Request  | Validação falhou, dados inválidos   |
| **401** | Unauthorized | Token ausente ou inválido           |
| **404** | Not Found    | Recurso não existe ou acesso negado |
| **409** | Conflict     | Email duplicado                     |

---

## 🚀 Como Executar os Testes

### Executar todos os testes

```bash
npm test
```

### Executar com cobertura

```bash
npm run coverage
```

### Executar teste específico

```bash
npm test -- --grep "Autenticação"
```

### Executar apenas testes de API

```bash
npm test -- test/api/gym-api.test.js
```

---

## 🔧 Configuração do Banco de Dados para Testes

O arquivo `test/helpers/database.js` fornece:

- **`connectTestDatabase()`**: Conecta ao MongoDB em memória
- **`clearTestDatabase()`**: Limpa collections após cada teste (beforeEach)
- **`disconnectTestDatabase()`**: Desconecta ao final (after)

```javascript
// Lifecycle dos testes
before(async () => {
  await connectTestDatabase(); // Conecta uma vez
});

beforeEach(async () => {
  await clearTestDatabase(); // Limpa entre testes
});

after(async () => {
  await disconnectTestDatabase(); // Desconecta ao final
});
```

---

## 📝 Funções Auxiliares Disponíveis

### `registerUser(email)`

Registra um novo usuário e retorna token JWT.

```javascript
const token = await registerUser("user@example.com");
```

### `createExercicio(token, payload?)`

Cria um exercício autenticado.

```javascript
const exercicio = await createExercicio(token);
```

### `createInstrutor()`

Cria um instrutor.

```javascript
const instrutor = await createInstrutor();
```

### `createTreino(token, overrides?)`

Cria um treino com instrutor.

```javascript
const treino = await createTreino(token, { nome: "Treino Custom" });
```

---

## ✅ Checklist de Qualidade

- [x] Todos os endpoints testados
- [x] CRUD completo para cada recurso
- [x] Validação de entrada (400 Bad Request)
- [x] Autenticação e autorização (401, 404)
- [x] Isolamento de dados por usuário
- [x] Paginação e filtros
- [x] Relacionamentos validados
- [x] Tratamento de erros
- [x] Casos vazios/default

---

## 📌 Notas Importantes

1. **Isolamento de Testes**: Cada teste começa com BD limpo
2. **Autenticação**: Use `authHeader(token)` para adicionar JWT às requisições
3. **Dados de Teste**: Payloads padrão em variáveis (`exercicioPayload`, `instrutorPayload`)
4. **Async/Await**: Todos os testes usam async/await
5. **Expectativas Chai**: Use `.to.equal()`, `.to.have.property()`, `.to.include()`

---

## 🔗 Arquivos Relacionados

- [src/app.js](../src/app.js) - Aplicação Express
- [src/config/database.js](../src/config/database.js) - Conexão MongoDB
- [test/helpers/database.js](./helpers/database.js) - Setup de testes
- [swagger.yaml](../swagger.yaml) - Documentação OpenAPI

---

**Última atualização**: 2026-07-17
**Versão da API**: 1.0.0
