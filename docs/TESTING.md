# ScalePay — Testing Strategy

## Objectives

Tests should be:

- meaningful
- deterministic
- fast
- easy to understand
- focused on business behavior

## Test Pyramid

```text
          E2E
        /     \
       /       \
 Integration
    /           \
   /             \
 Unit Tests
```

## Unit Tests

Focus on business rules:

- salary validation
- effective-date logic
- salary history behavior
- currency conversion
- analytics calculations
- employee validation

## API Integration Tests

Use Vitest + Supertest.

Recommended cases:

### Employee

1. list employees
2. pagination
3. search
4. country filter
5. department filter
6. status filter
7. sorting
8. get by ID
9. create
10. invalid create
11. duplicate employee code
12. update
13. missing employee

### Salary

14. create salary
15. invalid salary
16. missing employee
17. get current salary
18. get history
19. revise salary
20. close previous salary
21. preserve history
22. invalid currency/effective date

### Exchange Rate

23. list rates
24. get rate
25. unsupported currency
26. missing stored rate

### Analytics

27. summary
28. country grouping
29. department grouping
30. distribution

## Frontend Tests

Use Vitest for:

- API client behavior
- form validation
- rendering important states
- error states
- exchange-rate UI
- employee UI helpers

## E2E Tests

Use Playwright for a small number of critical workflows:

1. Dashboard loads.
2. Employee search and detail navigation.
3. Salary revision and history verification.

## Initial Smoke Test

A test such as:

```ts
describe('ScalePay frontend test setup', () => {
  it('runs Vitest successfully', () => {
    expect(true).toBe(true);
  });
});
```

is acceptable as a test-runner smoke test during setup, but it should not be considered meaningful feature coverage.

## Quality Gate

Before submission:

- tests pass
- TypeScript compiles
- Prisma validates
- migrations apply
- seed completes
- critical API flows work
- critical UI flows work
