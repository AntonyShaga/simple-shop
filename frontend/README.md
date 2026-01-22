# 🍕 Simple Shop — Frontend App

Frontend application for the **Simple Shop (Pizza Store)** full-stack project.

This client-side React application focuses on realistic user flows,
explicit state management, and predictable interaction with a real backend API.

The frontend is designed to clearly demonstrate routing, server state handling,
domain logic on the client, and user-focused UI behavior.

---

## 🎯 Core Principles

- Clear separation between server state and client state
- Explicit and predictable user flows
- Typed API interaction with backend
- Minimal global state, no hidden side effects
- Accessibility-aware UI implementation

---

## 🛠 Tech Stack

- React + TypeScript
- TanStack Router (routing)
- TanStack Query (server state)
- Context API (client-side cart state)
- Vite-based development setup

---

## 🚀 Key Features

### 🧭 Routing & Navigation

- Client-side routing using TanStack Router
- File-based routing with lazy-loaded pages
- Dynamic routes for products and orders
- Nested routing with shared application layout
- Centralized route definitions

Pages:

- Home (Pizza of the Day)
- Products list (paginated)
- Product details
- Cart
- Checkout
- Orders list
- Order details

---

### 📦 Server State & Data Fetching

- All server data handled via TanStack Query
- Typed API requests shared with backend contracts
- Pagination handled at API level
- Explicit loading and error states

---

### 🛒 Client-Side Cart State

- Cart state managed via React Context
- Cart provided at application root level
- Derived state:
    - total items count
    - total price
- Cart state is fully client-owned and predictable

---

### 🔁 User Flows

- Add items to cart from product pages and featured product
- Edit existing cart items (replace / merge logic)
- Select cart items for checkout
- Submit order and clear purchased items from cart
- View order history and order details

---

### 🧠 Domain Logic on Client

- Encapsulated cart mutation logic (`useAddToCart`)
- Explicit handling of:
    - item replacement
    - quantity merging
    - edit vs add flows
- No hidden mutations or implicit side effects

---

### 🎨 UI & UX

- Responsive layout (desktop and mobile)
- Modal-based mobile navigation
- Loading overlay for async operations
- Accessible markup (ARIA roles, labels, live regions)
- Shared layout components (Header, Footer)

---

## 🧩 Project Structure

```bash
frontend/
├─ pages/          # Route-level pages
├─ entities/       # Domain logic (cart)
├─ shared/         # Routes, config, navigation, UI helpers
├─ api.ts          # Typed API layer
├─ routes/         # Router definitions
└─ main.tsx
```

## ▶️ Running Locally

1. Install dependencies  
   `npm install`

2. Configure environment  
   Create a `.env` file with the following content:  
   `VITE_API_URL=http://localhost:3000`

3. Start development server  
   `npm run dev`