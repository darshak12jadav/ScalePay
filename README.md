# ScalePay

ScalePay is an employee salary management platform built for an HR Manager managing approximately 10,000 employees across multiple countries.

The application replaces spreadsheet-based salary management with a searchable web application for employee records, salary history, multi-currency reporting, and organization-level compensation analytics.

## Product Goals

- Manage employee records.
- Manage current and historical salaries.
- Preserve salary revisions using effective dates.
- Support salaries in multiple currencies.
- Normalize compensation to USD for organization-level analytics using deterministic exchange rates.
- Provide useful HR analytics.
- Support approximately 10,000 seeded employees.
- Maintain production-quality code, tests, documentation, and a clear architecture.

## Core Features

### Employee Management

- List employees with server-side pagination.
- Search employees.
- Filter by country, department, designation, and employment status.
- Create employees.
- Update employees.
- Deactivate/delete employees according to the API contract.
- View employee details.

### Salary Management

- View current salary.
- Create initial salary.
- Revise salary with an effective date.
- Preserve salary history.
- View salary history.
- Support multiple currencies.

### Analytics

- Total employee count.
- Total annual salary cost.
- Average salary.
- Median salary where supported by the database/query implementation.
- Salary distribution.
- Salary breakdown by country.
- Salary breakdown by department.
- Employee counts by country, department, and status.

### Exchange Rates

- List supported exchange rates.
- Retrieve a rate by currency.
- Use fixed/deterministic rates for reporting rather than a live FX provider.

## Deliberately Out of Scope

- Authentication and authorization.
- Payroll processing.
- Tax calculation.
- Payslip generation.
- Benefits and deductions.
- Attendance and leave management.
- Employee self-service.
- Live foreign-exchange integrations.
- Payroll-provider integrations.
- Email/notification workflows.
- Natural-language AI salary querying.
- Complex role-based access control.

These are excluded to keep the MVP focused on the core salary-management problem and to avoid unnecessary infrastructure complexity.

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- Vitest
- Supertest

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Hook Form
- Zod
- Vitest
- Playwright

### Architecture

- pnpm workspace monorepo
- Modular monolith backend
- REST/JSON APIs
- Repository → Service → Controller → Route layering

## Repository Structure

```text
ScalePay/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── middleware/
│   │   │   ├── modules/
│   │   │   │   ├── employees/
│   │   │   │   ├── salaries/
│   │   │   │   ├── analytics/
│   │   │   │   └── exchange-rates/
│   │   │   ├── shared/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── tests/
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── types/
│       ├── e2e/
│       └── package.json
├── packages/
│   └── shared/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── docs/
├── .env.example
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

Install:

- Node.js 20+ recommended
- pnpm
- PostgreSQL or a hosted PostgreSQL database such as Neon

Verify:

```bash
node --version
pnpm --version
```

## Clone and Install

```bash
git clone <YOUR_REPOSITORY_URL>
cd ScalePay
pnpm install
```

## Environment Variables

Create the required environment files from the project's examples.

Typical API configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
PORT=4000
```

Typical frontend configuration:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Do not commit real secrets.

## Database Setup

Validate the Prisma schema:

```bash
pnpm --filter api exec prisma validate
```

Format the Prisma schema:

```bash
pnpm --filter api exec prisma format
```

Generate the Prisma Client:

```bash
pnpm --filter api exec prisma generate
```

### Local Database Migrations

For a **new local database**, create the initial migration:

```bash
pnpm --filter api exec prisma migrate dev --name init
```

> **Important:** Run `migrate dev --name init` only when creating the initial migration. If the `init` migration already exists in `prisma/migrations`, do not run it again.

If you change the Prisma schema later, create a new migration with a descriptive name:

```bash
pnpm --filter api exec prisma migrate dev --name <migration-name>
```

For example:

```bash
pnpm --filter api exec prisma migrate dev --name add_exchange_rates
```

Commit the generated migration files:

```bash
git add prisma/migrations
```

```bash
git commit -m "chore: add database migration"
```

### Production Database Migrations

Production migrations are handled by the GitHub Actions **Production Migration** workflow.

The workflow runs:

```bash
pnpm --filter api exec prisma migrate deploy
```

`migrate deploy` applies committed migrations that have not yet been applied to the production PostgreSQL database.

> **Important:** Do not use `migrate dev` against the production database.

### Prisma Studio

Open Prisma Studio to inspect the database:

```bash
pnpm --filter api exec prisma studio
```

### Seed Database

To populate the database with the application's demo data:

```bash
pnpm --filter api db:seed
```

The seed script creates approximately 10,000 employees and related salary/reference data required by the application.

Production seeding is performed manually through the GitHub Actions **Seed Production Database** workflow rather than automatically on every deployment.

## Run Locally

### Start the API

```bash
pnpm --filter api dev
```

Expected API:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

### Start the Web Application

```bash
pnpm --filter web dev
```

Expected frontend:

```text
http://localhost:3000
```

### Typical First-Time Local Setup

For a fresh development environment:

```bash
pnpm install
```

```bash
pnpm --filter api exec prisma generate
```

```bash
pnpm --filter api exec prisma migrate dev --name init
```

```bash
pnpm --filter api db:seed
```

Start the API:

```bash
pnpm --filter api dev
```

In another terminal, start the web application:

```bash
pnpm --filter web dev
```

After the initial migration has been created, **do not run `migrate dev --name init` again**.

When the Prisma schema changes, create a new migration with an appropriate name:

```bash
pnpm --filter api exec prisma migrate dev --name <migration-name>
```

Commit the migration and push it to GitHub:

```bash
git add prisma/migrations
```

```bash
git commit -m "chore: add database migration"
```

```bash
git push
```

The GitHub Actions **Production Migration** workflow then applies the committed migration to the production database using:

```bash
pnpm --filter api exec prisma migrate deploy
```

## Health Check

```bash
curl http://localhost:4000/health
```

Expected response indicates API and database health.

## Testing

Run all tests using the repository's configured scripts.

API unit/integration tests use Vitest and Supertest.

Frontend tests use Vitest.

End-to-end tests use Playwright.

Example:

```bash
pnpm test
```

If the repository exposes package-specific scripts:

```bash
pnpm --filter api test
pnpm --filter web test
pnpm --filter web test:e2e
```

## Production Readiness Checks

Before submission:

```bash
pnpm exec prisma validate
pnpm prisma generate
pnpm test
```

Also verify:

- TypeScript compilation.
- API startup.
- Frontend startup.
- Database migrations.
- Seed execution.
- Employee CRUD.
- Salary creation/revision/history.
- Exchange-rate APIs.
- Analytics.
- Critical UI flows.

## Demo

Add the final deployed URL here:

```text
https://scale-pay-web.vercel.app/
```

Add the demo video here:

```text
https://drive.google.com/file/d/1rQC7ZSp5AAQLiFaoNAqfiZuGt8cHbHl0/view?usp=sharing
```

Add the demo Images here:

![ScalePay Dashboard](docs/images/image.png)
![ScalePay Dashboard](docs/images/image-1.png)
![ScalePay Dashboard](docs/images/image4.png)
![ScalePay Dashboard](docs/images/image3.png)

## Engineering Principles

ScalePay deliberately uses a modular monolith rather than microservices. Approximately 10,000 employees do not justify distributed-system complexity.

The database remains the source of truth. PostgreSQL handles filtering and aggregation. The browser receives paginated employee data rather than the entire employee population.

AI tools were used to accelerate exploration, implementation, testing, debugging, and documentation. Final engineering decisions, correctness, testing, and review remain the responsibility of the engineer.

## Assessment Context

This project was built as part of the Incubyte Software Craftsperson assessment.

The implementation prioritizes:

- clarity of thought
- structured problem solving
- engineering fundamentals
- product thinking
- maintainability
- meaningful tests
- intentional AI usage
- incremental commits
- pragmatic architecture
