# Supplier Management Approval App

A full-stack application for managing and approving new suppliers. Built with Node.js, Express, TypeORM, SQLite, and React.

## Prerequisites
- Node.js (v24.3.0 or higher recommended)
- npm (comes with Node.js)

## Setup & Running

This project uses a file-based SQLite database and requires zero extra setup (no Docker, no external services).

1. **Install Dependencies**
   From the root folder, navigate to both `backend` and `frontend` and install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Run Backend (API & Database)**
   ```bash
   cd backend
   npm run dev
   ```
   *Note: TypeORM migrations will automatically run and create `database.sqlite` on the first startup if not already there, but you can also run migrations manually via `npm run migration:run`.*

3. **Run Frontend (React App)**
   In a new terminal window:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Run Tests**
   ```bash
   cd backend
   npm test
   ```

## Architecture

The application is structured in a layered architecture to keep business logic testable and separate from HTTP concerns:
- **Frontend**: A React application bootstrapped with Vite, using a sleek dark mode design system (Vanilla CSS). State is managed locally, and API calls are abstracted into `apiClient.ts`.
- **Controllers** (`SupplierController.ts`): Express route handlers that parse requests and pass them to the service layer.
- **Service Layer** (`SupplierService.ts`): The core of the backend. Enforces all business rules (status transitions, VAT uniqueness, four-eyes principle). Completely decoupled from Express.
- **Repository / Database**: TypeORM handles the SQLite database interactions based on the `Supplier` entity. Migrations ensure schema consistency.

## Assumptions & Limitations
- **Simulated Authentication**: We use an `X-User-Id` header to simulate different users (Anna / Max). In a real app, this would be a JWT token extracted by a middleware.
- **Case-Insensitive VAT IDs**: The unique constraint on the database level prevents exact matches. The service trims spaces, but deep case-insensitive unique constraints in SQLite require `COLLATE NOCASE`, which isn't fully supported by TypeORM's auto-generation. For this prototype, basic string matching is used.
- **Error Handling**: Basic centralized error handling is in place, but could be expanded to use a robust validation library like Zod for better input parsing.

## What I'd improve with more time
1. **Real Authentication & Authorization**: Implement JWT and proper Role-Based Access Control (RBAC) so only managers can approve/reject.
2. **Validation Layer**: Use `Zod` or `class-validator` for strict schema validation on incoming DTOs.
3. **Frontend State Management**: Use `React Query` (TanStack Query) for fetching, caching, and invalidating supplier data instead of basic `useEffect` hooks.
4. **Testing**: Add end-to-end (E2E) tests with Cypress or Playwright for the frontend, and add controller-level integration tests using Supertest.
5. **Pagination & Filtering**: For production, the list API should support pagination, sorting, and filtering.
