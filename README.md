# WorkFlow Pro

Full-stack project management MVP: React + TypeScript frontend, Express + TypeScript API, PostgreSQL + Prisma ORM.

## Current functionality
- Create projects with validated name and optional description
- List latest 100 projects, including task counts
- API health endpoint and centralized error responses
- Initial schema for users, projects, tasks and roles

> This is a portfolio starter, **not yet production-ready**. Authentication, task CRUD, tests, deployment and RBAC are planned. The starter project-create endpoint is deliberately unauthenticated for local development only; do not expose it publicly until authorization is implemented.

## Prerequisites
- Node.js 20.19+ or 22.12+
- PostgreSQL database running locally (or a hosted PostgreSQL instance)

## Setup
1. Create PostgreSQL database `workflow_pro` and a user with access.
2. `cd server && npm install`
3. Copy `server/.env.example` to `server/.env`, and update `DATABASE_URL`.
4. `npx prisma migrate dev --name init`
5. `npm run dev` (API: http://localhost:4000)
6. In a separate terminal: `cd client && npm install`
7. Copy `client/.env.example` to `client/.env` (optional; defaults to port 4000)
8. `npm run dev` (frontend: http://localhost:5173)

## Quick API checks
- GET `http://localhost:4000/api/health`
- GET `http://localhost:4000/api/projects`
- POST `http://localhost:4000/api/projects` with JSON `{"name":"My first project","description":"Portfolio MVP"}`

## Architecture
`client/src/pages` → `client/src/api` → Express route → Prisma → PostgreSQL.

## Security before deployment
Implement login, authorization and rate limiting; restrict CORS to actual origins; use HTTPS and managed secrets. No real patient/customer or sensitive data in the demo.
