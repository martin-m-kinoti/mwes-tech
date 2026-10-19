# mwesTech IT Services

![IT Services image](https://github.com/martin-m-kinoti/mwes-tech/blob/main/mwes-tech-frontend/public/it_background_image.jpg)

A full-stack platform for mwesTech, a Kenyan IT services business. Clients browse services: Web Design & Development, Data Analytics, AI & Automations, Cyber Security, and IT Consultation. Place orders with a delivery timeline, and pay in Kenyan Shillings via M-Pesa (Safaricom Daraja STK Push). An admin dashboard tracks orders, payments, and users, and an AI assistant answers client questions.

## Features

**Clients**
- Sign up / sign in with Firebase Authentication
- Order services with a delivery duration; track progress (Pending → In progress → Completed)
- Pay for services with M-Pesa: STK push prompt, live payment timeline (prompt sent → PIN entered → confirmed), receipt tracking
- View payment history and chat with the AI assistant

**Admins**
- Dashboard stats (users, orders, monthly volume)
- Manage orders and update their status
- View all M-Pesa payment history (client, phone, amount, status, receipt)
- Manage users (list, promote to admin, delete — including their orders and payments)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, lucide-react |
| Backend | Node.js, Express 5 |
| Identity | Firebase Auth (ID tokens, custom claims for roles) |
| Orders & Payments | Firebase Data Connect (GraphQL over Cloud SQL for PostgreSQL) |
| Chat | MongoDB (chat history), Sequelize/PostgreSQL (messages), OpenAI |
| Payments | Safaricom Daraja API (M-Pesa STK Push, callback + status polling) |

Payments are finalized atomically in Data Connect (conditional updates on the `PENDING` status), so the Safaricom callback and the status poller can never double-finalize, and a success callback can correct a wrongly-failed record.

## Project Structure

```
mwes-tech/
├── auth-server/            # Express API
│   ├── routes/             # orders, payments (Daraja), chat, assistant
│   ├── config/             # Firebase Admin, Data Connect, Daraja service
│   ├── dataconnect/        # Data Connect schema + connector (GraphQL ops)
│   ├── middleware/         # auth (Bearer token) + role checks
│   ├── models/             # Sequelize models (chat)
│   └── scripts/            # admin role helper
└── mwes-tech-frontend/     # React SPA (client + admin dashboards)
```

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Data Connect enabled (Cloud SQL), Auth, and a service account key
- PostgreSQL and MongoDB (local chat storage)
- Safaricom Daraja account (sandbox or production)

### Backend (`auth-server/`)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```env
   PORT=5000
   DB_NAME=...            # Postgres (chat messages)
   DB_USER=...
   DB_PASSWORD=...
   DB_HOST=localhost
   DB_PORT=5432
   MONGO_URI=...          # MongoDB (chat)
   FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
   OPENAI_API_KEY=...
   DARAJA_ENV=sandbox     # or production
   DARAJA_KEY=...
   DARAJA_SECRET=...
   DARAJA_SHORTCODE=...
   DARAJA_PASSKEY=...
   DARAJA_CALLBACK_URL=https://.../api/payments/callback
   ```
3. Deploy the Data Connect schema and connector (orders + payments):
   ```bash
   firebase deploy --only dataconnect
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend (`mwes-tech-frontend/`)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with `VITE_API_BASE` and the `VITE_FIREBASE_*` config values from your Firebase project.
3. Run the dev server:
   ```bash
   npm run dev
   ```

### Admin Access

Grant the admin custom claim to a Firebase user:

```bash
npm run grant-admin -- user@example.com
```

The user must sign out and back in for the role to take effect.
