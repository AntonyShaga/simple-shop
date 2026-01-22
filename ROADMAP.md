# Roadmap

This document describes the current state, near-term plans, and potential future improvements
for the **Simple Shop (Pizza Store)** project.

The project is built as a learning-focused but production-structured full-stack application,
demonstrating real-world frontend–backend separation, data flow, and deployment.

---

## ✅ Completed

### Core Architecture

- Monorepo-style structure with `frontend`, `backend`, and `shared` packages
- Clear separation of frontend, backend, and shared domain types
- Environment-based configuration using `.env`
- Code quality tooling (ESLint, Prettier)

### Frontend — ✅ Completed

#### Pages & Routing

- Client-side routing implemented with TanStack Router
- File-based routing with lazy-loaded routes
- Dynamic route parameters (product and order details)
- Nested routing via `Outlet`
- Home page with featured “Pizza of the Day”
- Product listing page with pagination
- Product details page with size selection
- Cart page with grouped items and quantity management
- Checkout page with order confirmation flow
- Orders list page with pagination
- Order details page

#### Data Fetching & State

- API integration using typed fetch functions
- Server state management via TanStack Query
- Client-side cart state managed with React Context
- Centralized cart state provided at root level
- Derived cart state (total items, total price)

#### User Flows

- Add to cart from product and featured pages
- Edit existing cart items
- Select cart items for checkout
- Create order and clear purchased items from cart
- View order history and order details

#### UI & UX

- Responsive navigation with desktop and mobile menu
- Modal-based mobile navigation
- Loading overlay for async operations
- Accessible markup (ARIA roles, labels, live regions)
- Consistent layout components (Header, Footer)

#### Application Shell & Structure

- Root layout with shared application shell
- Centralized route definitions
- Shared navigation configuration
- Integrated developer tools for routing and data fetching

#### Domain Helpers & Integration

- Encapsulated cart mutation logic (`useAddToCart`)
- Support for add and edit cart flows
- Quantity merging and item replacement logic
- Shared API contracts reused from backend
- Frontend validation aligned with backend schemas

### Backend — ✅ Completed

### Core Server Setup

- Express.js server with TypeScript
- Environment-based configuration via `dotenv`
- PostgreSQL connection using `pg.Pool`
- CORS enabled
- JSON body parsing (`express.json`)
- Static file hosting via `/public` (pizza images)
- Healthcheck endpoint: `GET /health`

---

### Products Domain

#### Endpoints

- **GET `/products`**
    - Server-side pagination (`page`, `limit`, `offset`)
    - Total count calculation
    - Response format: `{ data, page, limit, total }`

- **GET `/products/:id`**
    - Fetch pizza type by id
    - Fetch all related SKUs (size / price)
    - 404 handling if product or SKUs not found

- **GET `/products/pizza-of-the-day`**
    - Deterministic daily pizza selection (based on days since epoch)
    - Aggregated response with pizza type and SKUs
    - Edge-case handling (no pizzas, selection failure)

#### Data Access

- Parameterized SQL queries
- Separation between pizza types and pizza SKUs
- Image URL mapping handled on backend

---

### Orders Domain

#### Create Order

- **POST `/orders`**
    - Payload validation using Zod (`CreateOrderSchema`)
    - Server-side validation of items and quantities
    - Price lookup from database (no trust in frontend)
    - Total price calculation on backend
    - Transactional order creation (`BEGIN / COMMIT / ROLLBACK`)
    - UUID-based identifiers for orders and order details
    - Initial order status: `CREATED`
    - Response: `{ ok, orderId, total }`

#### Read Orders

- **GET `/orders`**
    - Paginated list of orders
    - Sorted by creation date (newest first)
    - Response format: `{ data, page, limit, total }`

- **GET `/orders/:id`**
    - Aggregated query with joins:
        - `orders`
        - `order_details`
        - `pizzas`
        - `pizza_types`
    - Builds structured order response with items list
    - Proper 404 handling for missing orders

---

### Utilities

- Shared pagination helper:
    - Validates and normalizes `page` and `limit`
    - Enforces maximum limit
    - Computes SQL offset
- Shared TypeScript types for API contracts
- Centralized pagination logic reused across domains

---

### Safety & Data Integrity

- SQL injection protection via parameterized queries
- Server-side price calculation
- Transaction usage for critical write operations
- Schema-based request validation
- Typed API responses via shared contracts

---

## 🧭 Planned

### Product & Catalog Features

- Add product filtering by category
- Support category-based queries for product listings
- Extend product listing API with optional filter parameters

### Orders & User Flow

- Introduce basic authentication (users vs guests)
- Associate orders with authenticated users
- Add user order history endpoint
- Extend order lifecycle beyond `CREATED`
- Support order cancellation by user
- Allow order status updates based on business rules

### Payments

- Introduce basic payment flow for orders
- Add payment status tracking (pending / paid / failed)
- Prevent order modification after successful payment
- Prepare backend structure for external payment providers

### Admin & Management

- Introduce admin role
- Add protected admin endpoints
- Enable basic product management (create / update / delete)
- Allow admins to update order status (e.g. confirmed, cancelled)

### Access Control

- Implement role-based access control (RBAC)
- Restrict admin-only endpoints
- Protect sensitive operations from unauthorized access

### API Improvements

- Extend existing endpoints with optional query filters
- Improve API flexibility without breaking existing clients

---

## 💡 Nice to Have

### Error Handling

- Introduce centralized error-handling middleware
- Unify API error response format
- Reduce duplicated try/catch logic inside route handlers

### Architecture Improvements

- Gradual separation of concerns:
    - routers (HTTP layer)
    - services (business logic)
    - repositories (data access)
- Apply this structure incrementally for complex domains (e.g. orders)

### Reliability & Safety

- Improve request safety for critical write operations
- Consider basic idempotency strategy for order creation
- Prevent accidental duplicate order creation on retries

### Observability & Logging

- Add structured logging (e.g. request-level logs)
- Replace `console.log` with a dedicated logger
- Improve error and transaction visibility in production-like environments

### Testing

- Add basic integration tests for critical API flows
    - order creation
    - order retrieval
- Validate API contracts against real database behavior

### Database & Schema Management

- Introduce schema versioning or migrations
- Ensure predictable database state across environments

### Shared

- Stronger API response typings
- Shared validation schemas

---

