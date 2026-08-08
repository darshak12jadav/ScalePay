# ScalePay Developer Documentation

## 1. Purpose

This document explains how ScalePay is structured, developed, tested, and extended.

The project is designed for an HR Manager managing salary information for approximately 10,000 employees.

## 2. Architecture

ScalePay uses a modular monolith.

```text
Next.js
   |
   | HTTP/JSON
   v
Express API
   |
   +--> Employees
   +--> Salaries
   +--> Exchange Rates
   +--> Analytics
   |
   v
Prisma
   |
   v
PostgreSQL
```

A modular monolith was selected because the assessment's scale does not justify microservices.

## 3. Backend Layering

Every domain follows the general pattern:

```text
routes
  ↓
controller
  ↓
service
  ↓
repository
  ↓
Prisma/PostgreSQL
```

### Routes

Define HTTP endpoints and connect them to controllers.

### Controllers

Handle:

- HTTP request input
- calling services
- response status/body
- forwarding errors

Controllers should remain thin.

### Services

Contain business rules.

Examples:

- employee existence checks
- salary revision logic
- effective-date rules
- exchange-rate logic
- analytics business calculations

### Repositories

Contain database access.

Repositories should not contain HTTP concerns.

## 4. Employee Module

Responsibilities:

- employee CRUD
- search
- filtering
- pagination
- sorting
- employee validation

Important employee constraints:

- employee code is unique
- required identity/employment fields must be present
- list endpoints must remain paginated

## 5. Salary Module

Responsibilities:

- current salary
- salary creation
- salary revision
- salary history

### Salary Revision Algorithm

1. Confirm employee exists.
2. Validate the incoming salary.
3. Find the current/previous salary state.
4. Close the previous salary period.
5. Create the new salary record.
6. Commit both operations transactionally.

The system must not silently overwrite salary history.

## 6. Exchange Rate Module

Responsibilities:

- list rates
- get a rate by currency
- validate supported currencies

The repository currently uses Prisma to query exchange-rate records.

Example service behavior:

```text
getExchangeRates()
    -> repository.findAll()

getExchangeRate(currency)
    -> repository.findByCurrency(currency)
    -> 404 if missing
```

Exchange rates are deterministic reference data for the MVP.

## 7. Analytics Module

Analytics should aggregate at the database level where practical.

Do not load 10,000 employees into Node.js just to calculate a dashboard metric.

Typical operations:

- COUNT
- SUM
- AVG
- grouped aggregations
- salary distribution
- country grouping
- department grouping

## 8. Frontend Architecture

The frontend uses Next.js App Router.

Suggested structure:

```text
src/
├── app/
│   ├── dashboard/
│   ├── employees/
│   └── employees/[id]/
├── components/
│   ├── ui/
│   ├── employees/
│   ├── salaries/
│   └── dashboard/
├── hooks/
├── lib/
│   └── api.ts
└── types/
```

## 9. API Client

`src/lib/api.ts` centralizes HTTP communication.

It should:

- use `NEXT_PUBLIC_API_URL`
- set JSON headers
- parse JSON/text responses
- expose HTTP methods
- surface typed API errors

Avoid duplicating raw `fetch()` calls in every component.

## 10. Create Employee + Initial Salary

The create employee screen submits a combined payload when that endpoint is implemented:

```json
{
  "employee": {
    "employeeCode": "EMP-001",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Engineering",
    "designation": "Software Engineer",
    "country": "India",
    "employmentStatus": "ACTIVE"
  },
  "salary": {
    "annualSalary": 75000,
    "currency": "USD",
    "effectiveFrom": "2026-01-01"
  }
}
```

The frontend validates basic required fields before sending the request. The backend remains authoritative and validates again.

## 11. Exchange Rate UI

The exchange-rate page should use:

```text
GET /api/exchange-rates
```

for the list and:

```text
GET /api/exchange-rates/:currency
```

when a single currency lookup is required.

Do not hard-code API response values into the UI.

## 12. Database Workflow

Validate:

```bash
pnpm exec prisma validate
```

Format:

```bash
pnpm exec prisma format
```

Generate client:

```bash
pnpm prisma generate
```

Create/apply migration during development:

```bash
pnpm prisma migrate dev --name <migration-name>
```

Open Prisma Studio:

```bash
pnpm --filter api exec prisma studio
```

Seed:

```bash
pnpm --filter api db:seed
```

## 13. Testing Strategy

The project follows a test pyramid.

### Unit Tests

Test business logic in isolation.

Examples:

- salary calculations
- salary date rules
- currency conversion
- employee validation
- analytics transformations

### API Integration Tests

Use Supertest against the Express application.

Important scenarios:

- health endpoint
- employee listing
- employee search/filtering
- employee creation
- duplicate employee conflict
- employee update
- employee not found
- salary creation
- salary revision
- salary history
- exchange rates
- analytics

### Frontend Tests

Use Vitest for focused component/helper behavior.

### E2E Tests

Use Playwright for high-value user journeys:

1. Open dashboard.
2. Search employee.
3. Open employee details.
4. Create/revise salary.
5. Verify salary history.

## 14. Test Quality

Tests should be:

- deterministic
- fast
- readable
- isolated
- meaningful

Avoid tests that only assert that a function exists or that `true === true` once real functionality is available.

A smoke test such as:

```ts
describe('ScalePay frontend test setup', () => {
  it('runs Vitest successfully', () => {
    expect(true).toBe(true);
  });
});
```

is useful only as an initial test-runner verification. It should be replaced/supplemented by feature tests.

## 15. Recommended Test Coverage

Target approximately 20–30 meaningful frontend/API tests initially, then expand around business-critical salary behavior.

High-value cases include:

### Employee

1. list employees
2. paginate employees
3. search employees
4. filter by country
5. filter by department
6. filter by status
7. sort employees
8. get employee
9. create employee
10. reject invalid employee
11. reject duplicate employee
12. update employee
13. return 404 for missing employee

### Salary

14. create salary
15. reject invalid salary
16. reject missing employee
17. get current salary
18. get salary history
19. revise salary
20. close previous salary period
21. preserve salary history
22. reject invalid currency/date input

### Exchange Rate

23. list exchange rates
24. get rate by currency
25. reject unsupported currency
26. return 404 when valid currency has no stored rate

### Analytics

27. return summary metrics
28. group by country
29. group by department
30. return salary distribution

The exact number can change based on the final implementation, but coverage should prioritize business behavior over arbitrary test counts.

## 16. Seed Data

The seed script should generate 10,000 employees.

Recommended distributions:

- multiple countries
- multiple departments
- multiple designations
- ACTIVE/ON_LEAVE/INACTIVE statuses
- multiple currencies
- representative salary histories

Use deterministic/randomized generation carefully so test and development environments are reproducible.

## 17. Performance

For 10,000 employees:

- paginate employee lists
- filter in PostgreSQL
- aggregate in PostgreSQL
- index common filters
- avoid N+1 queries
- avoid returning unnecessary columns
- avoid live external FX calls in analytics

Do not introduce caching without a measured reason.

## 18. Security

Even though authentication is out of scope, follow basic engineering hygiene:

- validate all external input
- use parameterized ORM queries
- do not commit secrets
- configure CORS intentionally
- use Helmet/security middleware
- return safe error messages
- avoid exposing stack traces in production

## 19. Error Handling

Use centralized application errors.

Examples:

```text
BadRequestError -> 400
NotFoundError   -> 404
ConflictError   -> 409
```

The global error middleware translates errors into consistent HTTP responses.

## 20. Code Style

Prefer:

- small functions
- explicit types
- clear names
- domain-oriented modules
- early validation
- thin controllers
- testable services
- repository isolation

Avoid:

- deeply nested functions
- duplicated fetch logic
- business rules inside React components
- database access inside controllers
- unnecessary abstractions

## 21. Git Workflow

Commits should communicate development progression.

Recommended examples:

```text
docs: define ScalePay product requirements
feat(db): add employee and salary data model
feat(db): add deterministic seed data for 10000 employees
feat(api): implement employee management endpoints
test(api): add employee integration tests
feat(api): implement salary management
test(api): add salary history and validation tests
feat(api): implement exchange rate endpoints
feat(api): implement salary analytics
test(api): add analytics coverage
feat(web): build employee management UI
feat(web): build salary management UI
feat(web): build analytics dashboard
feat(web): integrate exchange rate page
test(web): add frontend feature tests
test(e2e): add critical HR workflows
docs: document architecture and trade-offs
chore: prepare production deployment
```

Do not create fake historical commits. Commit changes incrementally as they are actually made.

## 22. AI-Assisted Development

AI was used as a development collaborator, not as an unquestioned code generator.

Workflow:

```text
Understand requirement
        ↓
Explore with AI
        ↓
Evaluate alternatives
        ↓
Implement
        ↓
Run tests/type checks
        ↓
Review
        ↓
Refactor
```

AI can assist with:

- requirements exploration
- architecture alternatives
- boilerplate
- debugging
- tests
- documentation
- refactoring

The engineer remains responsible for final decisions and correctness.

## 23. Future Extensions

Potential future features:

- authentication/RBAC
- live exchange-rate provider
- bonus and compensation components
- payroll integrations
- notifications
- employee self-service
- AI/natural-language analytics
- materialized analytics views
- Redis caching
- read replicas

These are deliberately not required for the current MVP.
