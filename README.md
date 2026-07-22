# Gym Workouts API

API REST em Node.js e Express para uma plataforma de treinos de academia e treinos em casa.

## Funcionalidades

- Cadastro e login de usuarios com JWT.
- CRUD de exercicios com video, imagem, instrucoes e erros comuns.
- CRUD de instrutores.
- CRUD de treinos associados ao usuario autenticado.
- Cadastro de exercicios vinculados diretamente a um treino.
- Filtros por nome, tipo, nivel e intervalo de duracao.
- Paginacao na listagem de treinos.
- CRUD de fichas de treino, como Ficha ABC.
- Registro de historico de treinos realizados.
- Dashboard com total de treinos realizados, dias consecutivos, calorias, horas treinadas e evolucao mensal.
- Estatisticas de treinos com quantidade, tempo total e calorias estimadas.
- Swagger em `/api-docs`.
- MongoDB com Mongoose.
- Testes automatizados com Mocha, Chai, Supertest e MongoDB em memoria.
- Cobertura minima de 80% com nyc.
- Pipeline GitHub Actions.

## Arquitetura

```txt
src/
  config/
  controllers/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  validators/
```

Fluxo principal:

```txt
routes -> validators -> controllers -> services -> repositories -> models
```

## Variaveis de ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/gym-workouts-api
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=1d
```

Para deploy, use uma URI do MongoDB Atlas em `MONGODB_URI` e um valor forte em `JWT_SECRET`.

## Instalar dependencias

```bash
npm install
```

## Rodar localmente

```bash
npm run dev
```

API:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/api-docs
```

Health check:

```txt
GET /health
```

## Testes

```bash
npm test
```

Com cobertura minima:

```bash
npm run coverage
```

## Autenticacao

Rotas protegidas exigem:

```txt
Authorization: Bearer <token>
```

Endpoints publicos:

```txt
POST /auth/register
POST /auth/login
GET  /health
```

## Endpoints principais

```txt
POST   /auth/register
POST   /auth/login

POST   /exercicios
GET    /exercicios
GET    /exercicios/:id
PUT    /exercicios/:id
DELETE /exercicios/:id

POST   /treinos
GET    /treinos
GET    /treinos/:id
PUT    /treinos/:id
DELETE /treinos/:id
POST   /treinos/:id/exercicios
GET    /treinos/estatisticas

POST   /instrutores
GET    /instrutores
GET    /instrutores/:id
PUT    /instrutores/:id
DELETE /instrutores/:id

POST   /fichas
GET    /fichas
GET    /fichas/:id
PUT    /fichas/:id
DELETE /fichas/:id

POST   /historico
GET    /historico
GET    /historico/:id

GET    /dashboard/resumo
GET    /dashboard/evolucao-mensal
```

Exemplo de filtros e paginacao:

```txt
GET /treinos?nome=cardio&tipo=cardio&nivel=iniciante&duracaoMin=20&duracaoMax=60&page=1&limit=10
```

## Regras de negocio

- Todo treino pertence ao usuario autenticado.
- Usuarios nao podem acessar treinos, exercicios ou historicos de outros usuarios.
- Treinos nao podem ter exercicios duplicados.
- Todo exercicio associado a um treino deve existir e pertencer ao usuario autenticado.
- Todo treino deve ter um instrutor existente.
- Toda ficha so pode associar treinos existentes.
- Historico so pode ser registrado para treino existente do usuario autenticado.

## Deploy

O projeto esta preparado para hospedagem em Render, Railway, Fly.io ou outro provedor Node.js.

Configuracoes esperadas:

```txt
Build command: npm install
Start command: npm start
Environment:
  NODE_ENV=production
  PORT=<definido pelo provedor>
  MONGODB_URI=<URI do MongoDB Atlas>
  JWT_SECRET=<segredo forte>
  JWT_EXPIRES_IN=1d
```

Antes do deploy, o CI executa:

```bash
npm ci
npm run coverage
```
