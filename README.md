# 🔗 Encurtador de URL — Guia de Primeira Execução

Aplicação de encurtamento de URLs com rastreamento de cliques para desafio da ComHub. Monorepo com:
- Backend: Node.js + Express + TypeScript + Prisma (MySQL)
- Frontend: React + Vite

O foco deste README é permitir que qualquer pessoa rode o projeto do zero, em qualquer máquina, e depois apresentar Arquitetura e Estrutura de Pastas.

---

## ✅ Passo a passo

1) Requisitos
- Node.js 20.x
- npm
- Docker (para subir MySQL rapidamente)
- Portas livres: 3000 (API) e 5173 (Frontend)

2) Clonar e entrar
```bash
git clone https://github.com/odavisilva/encurtador-url.git
cd encurtador-url
```

3) Subir MySQL com Docker
```bash
docker run --name mysql-database -e MYSQL_ROOT_PASSWORD=secret -d -p 3306:3306 mysql:8.0
```

4) Instalar dependências do monorepo
```bash
npm install
```

5) Configurar a conexão do banco
Crie o arquivo `backend/.env` com sua URL de conexão:
```env
DATABASE_URL="mysql://root:secret@localhost:3306/encurtador_url"
```

6) Gerar Prisma Client e criar o schema
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name initial
cd ..
```

7) Rodar tudo em modo dev
```bash
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:3000

Se preferir rodar separado:
```bash
npm run dev:backend
npm run dev:frontend
```

8) Teste rápido da API
- Criar URL
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://www.example.com","slug":"exemplo"}'
```
- Redirecionar
```bash
curl -I http://localhost:3000/exemplo
```
- Estatísticas
```bash
curl http://localhost:3000/api/stats/exemplo
```

9) Variável do frontend (opcional)
Se a API estiver em outra origem/porta, crie `frontend/.env`:
```env
VITE_API_URL="http://localhost:3000"
```

## 🧪 Como rodar os testes (primeira vez)

1) Subir MySQL via Docker
```bash
docker run --name mysql-database -e MYSQL_ROOT_PASSWORD=secret -d -p 3306:3306 mysql:8.0
```

2) Gerar Prisma Client e migrar o schema
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name initial
cd ..
```

3) Rodar todos os testes do backend (a partir da raiz)
```bash
npm run test:backend
```

4) Rodar somente testes unitários (sem banco)
```bash
cd backend
npm run test:unit
```

5) Rodar somente testes E2E (com banco)
```bash
cd backend
npm run test:e2e
```

---

## 🔌 Endpoints principais (resumo)
- POST `/api/shorten` → cria link curto
- GET `/:slug` → redireciona e incrementa cliques
- GET `/api/stats/:slug` → devolve `{ id, slug, longUrl, clicks, createdAt }`

Exemplo de request (POST /api/shorten):
```json
{
  "longUrl": "https://exemplo.com/uma/url/bem/longa",
  "slug": "custom-slug"
}
```
Resposta (201):
```json
{
  "shortUrl": "http://localhost:3000/custom-slug",
  "slug": "custom-slug",
  "longUrl": "https://exemplo.com/uma/url/bem/longa"
}
```

---

## 🖥️ Arquitetura (visão e fluxo)

```
┌───────────────┐       HTTP        ┌───────────────┐       SQL        ┌───────────────┐
│   Frontend    │  <──────────────> │    Backend    │  <──────────────> │    MySQL      │
│ (React/Vite)  │                   │ (Express/TS)  │                   │ (Prisma ORM)  │
└───────────────┘                   └───────────────┘                   └───────────────┘

Fluxo:
1) App chama POST /api/shorten               → grava Url
2) Usuário acessa GET /:slug                 → redireciona e incrementa clicks
3) App chama GET /api/stats/:slug            → retorna estatísticas
```

Princípios adotados:
- API REST simples e direta
- Camadas: Controller → Service → Prisma
- Validação de entrada básica
- Tratamento de erros padronizado no backend

---

## 🗂️ Estrutura de Pastas
```
encurtador-url/
├── backend/
│   ├── src/
│   │   ├── app.ts               # App Express (rotas/middlewares)
│   │   ├── index.ts             # Bootstrap (porta 3000)
│   │   ├── controllers/         # createShortUrl, redirect, getStats
│   │   ├── services/            # UrlService (regra de negócio)
│   │   ├── middleware/          # errorHandler (e validações simples)
│   │   ├── utils/               # validateUrl, slug helpers
│   │   └── prisma.ts            # PrismaClient
│   ├── prisma/
│   │   ├── schema.prisma        # Modelo Url
│   │   └── migrations/          # Migrações Prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # UI principal + chamadas à API
│   │   ├── App.css              # Tema escuro com acento azul
│   │   └── main.tsx             # Entry React
│   ├── index.html
│   └── package.json
└── package.json                 # Scripts orquestradores (workspaces)
```

Scripts úteis (na raiz):
```bash
npm install          # instala tudo (workspaces)
npm run dev          # sobe backend e frontend
npm run dev:backend  # sobe só API na porta 3000
npm run dev:frontend # sobe só frontend na porta 5173
npm run build        # build backend + frontend
npm run test:backend # roda o test
```

---

## 📄 Gradião pela oportunidade

- **Davi Silva** — GitHub: [@odavisilva](https://github.com/odavisilva)

