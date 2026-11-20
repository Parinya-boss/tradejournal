# TradeJournal

TradeJournal is a work-in-progress full-stack application for managing trading accounts and tracking related activity. It includes a React frontend and a NestJS API backed by MariaDB.

## Current features

### Frontend

- Sign in and view the current user's trading accounts.
- Create a trading account and view its details using a dynamic route.
- Create deposit and withdrawal requests and view their history, including status and date.
- View each trading account's trade history, including prices and profit or loss.

### Backend API

- Register users and authenticate with JWT.
- Restrict customer and administrator actions by role.
- Manage trading accounts and trade records.
- Request deposits and withdrawals, and approve or reject requests as an administrator.

### In progress

- The frontend keeps the login session in memory, so refreshing the page signs the user out.
- Trade creation, updates, and deletion are currently available through the API only.

## Tech stack

- **Frontend:** React, TypeScript, React Router, Vite and Tailwind CSS.
- **Backend:** NestJS, TypeScript, TypeORM, JWT and bcrypt.
- **Database:** MariaDB.

## Getting started

The instructions below use Windows PowerShell. Run them on your own local development environment.

### Prerequisites

- Git.
- Node.js 20.19.x or 22.12.0 and above, and npm. Development was done with Node.js 26.4.0.
- A running local MariaDB server and a database user with permissions to create and modify tables.

### 1. Clone the repository

```powershell
git clone https://github.com/Parinya-boss/tradejournal.git
cd tradejournal
```

### 2. Create a local database

Connect to MariaDB with your preferred client and create an empty database. For example:

```sql
CREATE DATABASE tradejournal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

You can choose a different database name; use the same name in `DB_DATABASE` below.

### 3. Configure and start the API

In a terminal opened at the project root:

```powershell
cd api
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `api/.env` and set the variables for your local database. This is an example of the required fields; replace the placeholders with your own values:

```dotenv
PORT=3000
DB_PORT=3306
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
DB_DATABASE=tradejournal
JWT_SECRET=replace_with_a_long_random_secret
```

The API currently uses the database driver's default local host. Do not commit `api/.env` or real credentials to Git.

Apply the database migrations from the `api` directory:

```powershell
node --env-file=.env ./node_modules/typeorm/cli-ts-node-commonjs.js migration:run -d ./src/database/data-source.ts
```

Start the API and keep this terminal open:

```powershell
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

### 4. Start the frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The Vite development server forwards `/api` requests to the API on port 3000. Port 3001 must be available.

### 5. Create a local user and sign in

The API provides user registration; a registration page has not yet been added to the frontend. With the API running, use a separate PowerShell terminal to create a local example user:

```powershell
$body = @{
  email = "demo@example.com"
  display_name = "Demo User"
  password = "DemoPassword123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users/create" -Method Post -ContentType "application/json" -Body $body
```

Use these example credentials only for your local development database. Then sign in on the frontend and create a trading account. A newly registered user has the customer role.

## API overview

All routes use the `/api` prefix. Registration and login are public; the other routes below require a valid access token and may have role restrictions.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/users/create` | Register a customer. |
| POST | `/api/auth/login` | Sign in and receive an access token. |
| GET | `/api/users/me` | Get the signed-in user. |
| GET | `/api/tradingaccounts/me` | List the signed-in user's accounts. |
| POST | `/api/tradingaccounts/create` | Create a trading account. |
| GET | `/api/transactions/me` | List the customer's transactions. |
| POST | `/api/transactions/createtransactions` | Create a deposit or withdrawal request. |
| POST | `/api/trades` | Create a trade record. |

## Project structure

```text
TradeJournal/
├── api/        # NestJS API, database entities and migrations
└── frontend/   # React application
```
