# Copa Stickers 2026

Ecommerce/ERP de figurinhas da Copa 2026 com frontend estatico e API Node.js + TypeScript + MySQL.

## Estrutura

```text
frontend/
  css/
  js/
  assets/
  index.html
  checkout.html
  admin.html
  login.html
  orders.html
  success.html
backend/
  src/
    controllers/
    routes/
    services/
    database/
    middlewares/
    utils/
  server.ts
```

## Backend local

```bash
cd backend
npm install
copy .env.example .env
npm run db:migrate
npm run dev
```

Para gerar o build de producao do backend:

```bash
npm run build
npm start
```

Prisma foi adicionado ao backend sem substituir as rotas atuais. Comandos uteis:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:studio
```

Crie um admin chamando `POST /api/auth/register` uma vez:

```json
{
  "name": "Admin",
  "email": "admin@copa.com",
  "password": "senha-forte"
}
```

## Variaveis do Render

```text
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://seu-frontend.vercel.app
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

Build command: `npm install && npm run build`

Start command: `npm start`

Depois do primeiro deploy, rode no shell do Render:

```bash
npm run db:migrate
```

## Frontend na Vercel

O deploy usa `vercel.json` e serve `frontend/` como site estatico.

Antes de publicar, ajuste `frontend/js/config.js` se a URL Render mudar:

```js
apiBaseUrl: "https://sua-api.onrender.com/api"
```

## Banco

Schema principal em `backend/src/database/schema.sql`.

Seed em `backend/src/database/seed.sql`.

Tabelas:

- `admins`
- `customers`
- `products`
- `coupons`
- `orders`
- `order_items`
- `favorites`

## Checklist

- Frontend e backend separados.
- API versionada em `/api`.
- Checkout com transacao MySQL.
- Baixa de estoque atomica.
- Admin JWT com refresh token.
- Produtos, pedidos, dashboard e status corrigidos.
- URLs centralizadas.
- Deploy Vercel + Render documentado.
