# Gym Workouts API

API REST desenvolvida em **Node.js** e **Express** para gerenciamento de treinos, exercícios e fichas de academia.

O projeto foi desenvolvido com foco em **boas práticas de Quality Assurance**, aplicando autenticação JWT, documentação Swagger, testes automatizados e integração contínua.

---

# Principais funcionalidades

- Autenticação e autorização com JWT
- CRUD completo de treinos, exercícios, fichas e instrutores
- Dashboard com estatísticas dos treinos
- Paginação e filtros de pesquisa
- Isolamento de dados por usuário
- Documentação interativa com Swagger/OpenAPI
- Tratamento centralizado de erros
- Validação de dados utilizando Joi

---

# Qualidade do projeto

- Testes automatizados com **Mocha**, **Chai** e **Supertest**
- Cobertura mínima de **80%**
- Pipeline de CI utilizando **GitHub Actions**
- Arquitetura em camadas
- Repository Pattern
- Factory Pattern
- Services Pattern

---

# Tecnologias

## Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Segurança

- JWT
- bcryptjs
- Helmet
- Joi
- CORS

## Testes

- Mocha
- Chai
- Supertest
- NYC
- Mochawesome

## Ferramentas

- Swagger / OpenAPI
- GitHub Actions

---

# Arquitetura

O projeto segue uma arquitetura em camadas para facilitar manutenção, escalabilidade e testes.

```
src/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── validators/
├── middlewares/
└── config/
```

Fluxo da aplicação:

```
Request
    ↓
Routes
    ↓
Validators
    ↓
Authentication
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
MongoDB
```

---

# Documentação

Após iniciar a aplicação, a documentação pode ser acessada em:

```
http://localhost:3000/api-docs
```

---

# Como executar

```bash
git clone https://github.com/adrianakely/desafio04-APIdeCadastro.git

cd desafio04-APIdeCadastro

npm install

cp .env.example .env

npm run dev
```

A API ficará disponível em:

```
http://localhost:3000
```

---

# Executando os testes

```bash
npm test
```

Cobertura de testes:

```bash
npm run coverage
```

---

# Integração Contínua

O projeto possui pipeline configurada no **GitHub Actions**, responsável por:

- Instalar dependências
- Executar todos os testes
- Validar cobertura mínima
- Validar o build da aplicação

---

# Estrutura da API

## Autenticação

```
POST /auth/register
POST /auth/login
```

## Exercícios

```
POST   /exercicios
GET    /exercicios
PUT    /exercicios/:id
DELETE /exercicios/:id
```

## Treinos

```
POST   /treinos
GET    /treinos
PUT    /treinos/:id
DELETE /treinos/:id
```

## Fichas

```
POST   /fichas
GET    /fichas
PUT    /fichas/:id
DELETE /fichas/:id
```

## Dashboard

```
GET /dashboard/resumo
GET /dashboard/evolucao-mensal
```

---

# Segurança

- JWT
- Senhas criptografadas com bcrypt
- Helmet
- CORS
- Validação com Joi
- Isolamento de dados por usuário
