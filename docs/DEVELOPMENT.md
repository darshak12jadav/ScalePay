# ScalePay — Development Guide

## Local Setup

```bash
git clone <YOUR_REPOSITORY_URL>
cd ScalePay
pnpm install
```

Configure environment variables.

Validate Prisma:

```bash
pnpm exec prisma validate
```

Format:

```bash
pnpm exec prisma format
```

Generate:

```bash
pnpm prisma generate
```

Migrate:

```bash
pnpm prisma migrate dev --name init
```

Seed:

```bash
pnpm --filter api db:seed
```

Run API:

```bash
pnpm --filter api dev
```

Run web:

```bash
pnpm --filter web dev
```

## Useful Database Commands

```bash
pnpm --filter api exec prisma studio
pnpm exec prisma migrate status
pnpm exec prisma generate
```

## Useful Verification Commands

```bash
pnpm exec prisma validate
pnpm exec prisma format
pnpm test
```

Run TypeScript checks using the repository's configured scripts or:

```bash
pnpm --filter api exec tsc --noEmit
```

## API Smoke Tests

```bash
curl http://localhost:4000/health
curl "http://localhost:4000/api/employees?page=1&pageSize=10"
curl "http://localhost:4000/api/employees?search=Patel"
curl "http://localhost:4000/api/employees?country=India&department=Engineering&employmentStatus=ACTIVE"
curl "http://localhost:4000/api/exchange-rates"
curl "http://localhost:4000/api/exchange-rates/INR"
curl "http://localhost:4000/api/analytics/summary"
curl "http://localhost:4000/api/analytics/by-country"
curl "http://localhost:4000/api/analytics/by-department"
curl "http://localhost:4000/api/analytics/salary-distribution"
```

For ID-specific endpoints, replace `<EMPLOYEE_ID>` with a real ID.

## Development Rules

- Keep controllers thin.
- Put business logic in services.
- Keep Prisma queries in repositories.
- Validate request input.
- Keep API client logic centralized.
- Preserve salary history.
- Avoid unnecessary dependencies.
- Do not commit secrets.
- Add tests with new business behavior.
- Make incremental commits.

## Adding a New Feature

1. Define the requirement.
2. Update product/design docs if needed.
3. Decide data-model changes.
4. Add Prisma migration.
5. Implement repository.
6. Implement service.
7. Implement controller/routes.
8. Add tests.
9. Implement frontend.
10. Add frontend/E2E coverage where appropriate.
11. Update API documentation.
12. Run verification commands.
13. Commit the feature.

## Git Commit Examples

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
