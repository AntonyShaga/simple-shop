# 🍕 Simple Shop — Backend API

Backend service for the **Simple Shop (Pizza Store)** full-stack project.

This API is designed to demonstrate correct ownership of business logic,
transactional safety, and explicit data validation.  
The backend acts as the single source of truth for pricing, order creation,
and domain consistency.

---

## 🎯 Core Principles

- Server-side ownership of business logic
- No trust in frontend input
- Transactional safety for write operations
- Explicit validation and predictable API contracts
- Clear domain separation (Products / Orders)

---

## 🛠 Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL (`pg` / connection pool)
- Zod (request validation)
- Railway-ready deployment

---

## 🚀 Key Features

### 🛡 Transactional Order Creation

Order creation is wrapped in explicit SQL transactions
(`BEGIN / COMMIT / ROLLBACK`), ensuring that an order and its related items
are either fully created or not created at all.

This prevents partial writes and guarantees data consistency.

---

### ⚖️ Server-Side Validation & Calculation

- Incoming payloads are validated using Zod schemas
- Item prices are always fetched from the database
- Total order price is calculated on the backend
- Client-provided values are never trusted

---

### 📅 Deterministic Business Logic

The "Pizza of the Day" feature is implemented using a deterministic algorithm
based on the current epoch day index.  
All users see the same featured product for a given day without manual updates.

---

## 📖 API Reference

### 📦 Products

| Method | Endpoint                     | Description                                         |
|--------|------------------------------|-----------------------------------------------------|
| `GET`  | `/products`                  | Paginated list of pizza types                       |
| `GET`  | `/products/:id`              | Product details with all available sizes and prices |
| `GET`  | `/products/pizza-of-the-day` | Deterministic daily featured pizza                  |

Pagination response format:

```json
{
  "data": [],
  "page": 1,
  "limit": 6,
  "total": 42
}
```

## 🔐 Safety & Data Integrity

| Aspect                        | Description                                                                                        |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Parameterized SQL queries** | All database queries use parameterized statements to prevent SQL injection                         |
| **Server-side price lookup**  | Product prices are always fetched from the database and never trusted from client input            |
| **Transactional writes**      | Critical write operations are atomic and wrapped in SQL transactions (`BEGIN / COMMIT / ROLLBACK`) |
| **UUID identifiers**          | Orders and order items use UUIDs to ensure global uniqueness                                       |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
DEFAULT_PAGE_LIMIT=6
MAX_PAGE_LIMIT=50
```

## ▶️ Running Locally

1. Install dependencies  
   `npm install`

2. Start development server  
   `npm run dev`

API will be available at `http://localhost:3000`