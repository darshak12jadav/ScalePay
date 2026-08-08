# ScalePay — Engineering Trade-offs

## Modular Monolith

Chosen instead of microservices because 10,000 employees do not require distributed services.

Benefits:

- simpler deployment
- simpler debugging
- simpler transactions
- lower operational overhead
- clear domain boundaries

## PostgreSQL

Chosen because salary data is relational and requires consistent transactions and aggregation.

## Prisma

Chosen for type-safe database access, migrations, schema management, and productive TypeScript development.

## Fixed Exchange Rates

Chosen instead of live FX because:

- analytics remain deterministic
- tests remain deterministic
- no external service dependency
- the assessment is about salary management, not FX infrastructure

## Salary History

Chosen because compensation is temporal. Historical revisions are required to understand how the organization pays people over time.

## Base Salary Only

Chosen to keep the MVP focused. A full compensation model would include bonuses, allowances, deductions, taxes, and benefits and would add unnecessary domain complexity.

## Authentication Out of Scope

The assessment assumes an authenticated HR persona. Implementing authentication would distract from the core domain being evaluated.

## Redis Optional

10,000 employees can be handled comfortably with PostgreSQL. Redis should only be introduced after profiling demonstrates a real need.

## AI Querying Out of Scope

Structured analytics and filters provide deterministic answers. Natural-language querying is a future extension because it introduces correctness and safety concerns.

## Pagination

The UI does not load all 10,000 employees. Server-side pagination keeps response sizes and rendering predictable.

## Database Aggregation

Analytics should be calculated in PostgreSQL where practical to minimize network traffic and Node.js memory usage.
