# Hackathon Planner

Plataforma de organização escolar para professores — gerencie turmas, aulas, avaliações, alertas e planejamentos bimestrais.

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Node.js](https://nodejs.org/) 20+ (para o frontend)
- [WSL](https://learn.microsoft.com/pt-br/windows/wsl/) (se estiver no Windows)

---

## 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Hackathon-Planner
```

---

## 2. Backend (Docker)

### 2.1 Configure as variáveis de ambiente

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` se necessário. Por padrão já funciona com o Docker Compose.

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da API |
| `DATABASE_URL` | `postgres://postgres:postgres@postgres:5432/postsdb` | Conexão com o banco |
| `JWT_SECRET` | — | Segredo para tokens JWT (altere em produção) |
| `GEMINI_API_KEY` | — | Chave da API Google Gemini (funcionalidade de IA) |

### 2.2 Suba os serviços

```bash
cd backend
docker compose up -d
npm run dev
```

Isso inicia:
- `hackathon-planner-api` → API REST em `http://localhost:3000`
- `postgres` → Banco de dados PostgreSQL em `localhost:5432`
- `adminer` → Interface visual do banco em `http://localhost:8080`

### 2.3 Aplique o schema no banco

```bash
cd backend
npx prisma db push
```

### 2.4 Crie os usuários padrão (seed)

```bash
cd backend
 npx tsx prisma/seed.ts
```

Credenciais criadas:

| Usuário | Email | Senha | Role |
|---|---|---|---|
| Administrador | `admin@planner.dev` | `planner123` | ADMIN |
| Professor | `professor@planner.dev` | `planner123` | USER |

---

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

> Se a porta 5173 estiver em uso, o Vite usará a próxima disponível (ex: 5174). Verifique o terminal.

---

## 4. Resumo das URLs

| Serviço | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3000/api` |
| Swagger (docs) | `http://localhost:3000/api-docs` |
| Adminer (banco) | `http://localhost:8080` |

---

## 5. Parar os serviços

```bash
# Backend
#Ctrl+C no terminal onde o npm run dev está rodando
cd backend && docker compose down

# Frontend
# Ctrl+C no terminal onde o npm run dev está rodando
```

---

## Estrutura do projeto

```
Hackathon-Planner/
├── backend/          # API Node.js + Express + Prisma (dockerizado)
│   ├── prisma/       # Schema e seed do banco de dados
│   ├── src/          # Código-fonte da API
│   └── uploads/      # Arquivos enviados pelos usuários (PDF, vídeo)
└── frontend/         # SPA React + Vite + TypeScript
    └── src/
        ├── application/   # Hooks e casos de uso
        ├── domain/        # Tipos e interfaces
        ├── infrastructure/# Clientes HTTP
        └── presentation/  # Componentes e páginas
```
